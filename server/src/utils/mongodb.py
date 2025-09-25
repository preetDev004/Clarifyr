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

chatbots_schema = {
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["name", "expertise_docs", "created_by", "whitelist_domains", "created_at", "updated_at"],
            "properties": {
                "name": {
                    "bsonType": "string"
                },
                "experitse_docs": {
                    "bsonType": "array",
                    "items": {
                        "bsonType": "objectId"
                    }
                },
                "created_by": {
                    "bsonType": "string"
                },
                "whitelist_domains": {
                    "bsonType": "array",
                    "items": {
                        "bsonType": "string"
                    }
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

chats_schema = {
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["created_at", "chatbot_id"],
            "properties": {
                "created_at": {
                    "bsonType": "date"
                },
                "chatbot_id": {
                    "bsonType": "objectId"
                },
            }
        }
    }
}

messages_schema = {
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["chat_id", "message", "role", "created_at"],
            "properties": {
                "chat_id": {
                    "bsonType": "objectId"
                },
                "message": {
                    "bsonType": "string"
                },
                "role": {
                    "bsonType": "string",
                    "enum": ["user", "assistant"]
                },
                "created_at": {
                    "bsonType": "date"
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
        if "chatbots" not in db.list_collection_names():
            logger.info("creating the chatbots collection...")
            db.create_collection("chatbots", **chatbots_schema)
            db["chatbots"].create_index([("name", 1), ("created_by", 1)], unique=True)
        if "chats" not in db.list_collection_names():
            logger.info("creating the chats collection...")
            db.create_collection("chats", **chats_schema)
        if "messages" not in db.list_collection_names():
            logger.info("creating the messages collection...")
            db.create_collection("messages", **messages_schema)
            db["messages"].create_index([("chat_id", 1), ("created_at", 1)])
            
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


