import os

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from sentence_transformers import SentenceTransformer
import numpy as np
import nltk

# Connect to Qdrant vector database
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_ENDPOINT"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

# Create Qdrant collection if doesn't exist
if not qdrant_client.collection_exists("chunks"):
   qdrant_client.create_collection(
      collection_name="chunks",
      vectors_config=VectorParams(size=768, distance=Distance.COSINE),
   )

qdrant_client.create_payload_index(
    collection_name="chunks",
    field_name="file_name",
    field_schema="keyword",
)

# Setup embedding model
os.environ["TOKENIZERS_PARALLELISM"] = "false"
model_path = "./models/llm-embedder"

# Load embedding model
try:
    # Try finding local model
    model = SentenceTransformer(model_path)
except:
    # Load model from the HuggingFace
    model = SentenceTransformer('BAAI/llm-embedder')

# Download required NLTK resources
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))