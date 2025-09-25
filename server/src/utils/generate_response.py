from loguru import logger
from bson import ObjectId
from typing import Annotated

from utils.mongodb import get_database
from utils.llm import generate_response as llm_generate_response

def generate_response(message, chat_id):
    chats_collection = get_database()["chats"]
    messages_collection = get_database()["messages"]
    chatbots_collection = get_database()["chatbots"]

    chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
    messages = map(lambda x: {"role": x["role"], "content": x["message"]}, messages_collection.find({"chat_id": ObjectId(chat_id)}))

    if not chat:
        return "Chat not found"
    
    chatbot = chatbots_collection.find_one({"_id": chat["chatbot_id"]})

    if not chatbot:
        return "Chatbot not found"
    
    messages = list(messages)
    
    return llm_generate_response(messages, chatbot, chat_id)