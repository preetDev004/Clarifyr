import pytest
from pymongo import MongoClient
from loguru import logger
from dotenv import load_dotenv
import os

load_dotenv('/server/.env')

mongo_client = None

def connect_to_db():
    global mongo_client
    try:
        conn_string = os.getenv("MONGODB_CONNECTION_STRING")
        logger.info(f"Connecting to MongoDB with: {conn_string}")
        mongo_client = MongoClient(conn_string)
        logger.info("Connected to MongoDB!")
        db_name = os.getenv("DB_NAME")
        valid_db_names = {"test"}
        if db_name not in valid_db_names:
            raise Exception(f"Invalid DB_NAME '{db_name}'. Must be 'test'.")
        return mongo_client[db_name]
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

def get_database():
    db_name = os.getenv("DB_NAME", "main")
    if db_name not in {"main", "test"}:
        raise Exception(f"Invalid DB_NAME '{db_name}'. Must be 'test'.")
    return mongo_client[db_name]

connect_to_db()

@pytest.fixture(scope="function", autouse=True)
def wipe_test_database():
    db = get_database()
    db_name = db.name
    
    if db_name != "test":
        logger.warning(f"Skipping database wipe: not in 'test' database (current: {db_name})")
        yield
        return
    
    collections = db.list_collection_names()
    for collection in collections:
        result = db[collection].delete_many({})
        logger.debug(f"Deleted {result.deleted_count} documents from '{collection}' in test database before session.")
    
    yield
    
    collections = db.list_collection_names()
    for collection in collections:
        result = db[collection].delete_many({})
        logger.debug(f"Deleted {result.deleted_count} documents from '{collection}' in test database after session.")