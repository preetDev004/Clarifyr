import uuid
import os

from loguru import logger
import textract

from config.file_upload import allowed_file_extensions, maximum_file_size

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
		data["name"] = file_name
		data["local-name"] = generated_file_name
		data["full-path"] = path
		data["type"] = file.content_type
		data["data"] = text_data.decode('utf-8')

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
