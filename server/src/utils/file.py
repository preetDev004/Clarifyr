import uuid
import os
import re

import nltk
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from loguru import logger
import textract
from sentence_transformers import SentenceTransformer

from config.file_upload import allowed_file_extensions, maximum_file_size
from utils.mongodb import get_mongo_client

os.environ["TOKENIZERS_PARALLELISM"] = "false"
model_path = "./models/llm-embedder"

try:
    model = SentenceTransformer(model_path)
except:
    model = SentenceTransformer('BAAI/llm-embedder')

# Download required NLTK resources
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')

def extract_file_data(file):
	data = {
		"name": "",
		"type": "",
		"data": None
	}

	# Generate file name and path
	file_name = process_file_name(file.filename)
	file_id = str(uuid.uuid4())
	generated_file_name = file_id + '.' + file_name
	user_documents_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'user_documents'))
	path = os.path.join(user_documents_dir, generated_file_name)

	if not os.path.exists(user_documents_dir):
		os.makedirs(user_documents_dir)
		logger.debug(f"Directory created: {user_documents_dir}")

	logger.debug(f"Saving file to {path}")

	# Save file
	file.save(path)

	# Extract data using textract
	text_data = textract.process(path, output_encoding='utf-8')

	if file:
		data["original-name"] = file_name
		data["name"] = generated_file_name
		data["full-path"] = path
		data["type"] = file.content_type
		data["data"] = text_data.decode('utf-8')
		data["size"] = os.path.getsize(path)

	return data

def process_file_name(file_name):
    file_name = ''.join(c if c.isalnum() or c in ['-', '.'] else '_' for c in file_name)
    file_name = file_name.lower()
    return file_name

def validate_file(data):
	# Check file type
	if data["type"] not in allowed_file_extensions.values():
		return False, "Invalid file type, only pdf, docx, and txt are allowed"

	# Check file size
	if len(data["data"]) > maximum_file_size:
		return False, "File size exceeds the maximum limit of 25MB"

	return True, None

def preprocess_data(text):
	stop_words = set(stopwords.words("english"))

	text = text.lower()

	# Replace all white spaces with a space
	text = re.sub(r'\s+', ' ', text).strip()
	
	# Tokenize text
	tokens = word_tokenize(text)
	# Remove stopwords
	filtered_tokens = [word for word in tokens if word not in stop_words]

	return filtered_tokens

def nltk_chunking(words, file_name, chunk_size=128):
	collection = get_mongo_client()["main"]["documents"]

	try:
		# Token by token chunking with 50% overlap
		chunks = []
		for i in range(0, len(words), chunk_size//2):
			chunks.append(" ".join(words[i:i+chunk_size]))

		logger.debug(f"Chunking complete: {len(chunks)} chunks generated")

		# Generate embeddings
		embeddings = model.encode(chunks, batch_size=12)

		logger.debug(f"Embedding complete: {embeddings.shape} shape")

		# Update file processing status
		collection.update_one(
			{"name": file_name},
			{"$set": {"status": "success"}}
		)

		logger.debug("File processing completed successfully")
	except Exception as e:
		logger.error(e)

		# Update file processing status
		collection.update_one(
			{"name": file_name},
			{"$set": {"status": "failed"}}
		)