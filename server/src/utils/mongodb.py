from pymongo import MongoClient
from loguru import logger
import os

mongo_client = None

users_schema = {
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["user_id", "email_address"],
            "properties": {
                "user_id": {
                    "bsonType": "string"
                },
                "email_address": {
                    "bsonType": "string"
                }
            }
        }
    }
}

def connect_to_db():
    global mongo_client
    try:
        mongo_client = MongoClient(os.getenv("MONGODB_CONNECTION_STRING"))
        logger.info("Connected to MongoDB!")
        # see if the collections exist, otherwise create them
        if "users" not in mongo_client["main"].list_collection_names():
            logger.info("creating the users collection...")
            mongo_client["main"].create_collection("users", **users_schema)
            mongo_client["main"]["users"].create_index([("user_id", 1)], unique=True)
    except Exception as e:
        raise Exception("Error while connecting to the db: ", e)

def shutdown_db_connection():
    global mongo_client
    try:
        mongo_client.close()
        logger.info("Disconnected from MongoDB!")
    except Exception as e:
        raise Exception("Error while discconnecting from the db: ", e)
    
def get_mongo_client():
    global mongo_client
    return mongo_client


