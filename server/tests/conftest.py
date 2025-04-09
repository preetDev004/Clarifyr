import pytest
from loguru import logger
from dotenv import load_dotenv
from src.utils.mongodb import get_database, connect_to_db

load_dotenv('/server/.env')
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