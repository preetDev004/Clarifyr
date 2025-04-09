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

document_schema = {
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["name", "user_id", "content", "type", "size", "created_at", "updated_at"],
            "properties": {
                "name": {
                    "bsonType": "string"
                },
                "user_id": {
                    "bsonType": "string"
                },
                "content": {
                    "bsonType": "string"
                },
                "type": {
                    "bsonType": "string"
                },
                "size": {
                    "bsonType": "int"
                },
                "created_at": {
                    "bsonType": "date"
                },
                "updated_at": {
                    "bsonType": "date"
                },
            }
        }
    }
}

# chatbots_schema = {
#     "validator": {
#         "$jsonSchema": {
#             "bsonType": "object",
#             "required": ["name", "expertise_docs"],
#             "properties": {
#                 "name": {
#                     "bsonType": "string"
#                 },
#                 "description": {
#                     "bsonType": "string"
#                 },
#                 ""
#             }
#         }
#     }
# }

def connect_to_db():
    global mongo_client
    try:
        mongo_client = MongoClient(os.getenv("MONGODB_CONNECTION_STRING"))
        logger.info("Connected to MongoDB!")
        db_name = os.getenv("DB_NAME", "main")
        valid_db_names = {"main", "test"}
        if db_name not in valid_db_names:
            raise Exception("Invalid DB_Name '{db_name}'. Did you mistype DB_Name during testing?")
        db = mongo_client[db_name]
        # see if the collections exist, otherwise create them
        if "users" not in db.list_collection_names():
            logger.info("creating the users collection...")
            db.create_collection("users", **users_schema)
            db["users"].create_index([("user_id", 1)], unique=True)
        if "documents" not in db.list_collection_names():
            logger.info("creating the documents collection...")
            db.create_collection("documents", **document_schema)
            db["documents"].create_index([("name", 1)], unique=True)
    except Exception as e:
        raise Exception("Error while connecting to the db: ", e)

def shutdown_db_connection():
    global mongo_client
    try:
        mongo_client.close()
        logger.info("Disconnected from MongoDB!")
    except Exception as e:
        raise Exception("Error while discconnecting from the db: ", e)

def get_database():
    db_name = os.getenv("DB_NAME", "main")
    return mongo_client[db_name]


