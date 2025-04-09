from app import app
from flask import request, Response, json
from loguru import logger
from utils.auth import get_clerk_user
from utils.mongodb import get_database
from bson import json_util
from bson.objectid import ObjectId
import os

@app.route("/chatbot", methods=["POST"])
def create_chatbot():
    logger.info("POST /chatbot hit!")
    response = None
    auth = get_clerk_user(request.headers)
    if not auth["successful"]:
        return auth["response"]
    clerk_user = auth["user"]
    
    # insert the new chatbot
    req_json = request.get_json()
    logger.debug("POST /chatbot request JSON: {}", req_json)
    
    collection = get_database()["chatbots"]
    
    try:
        ins = collection.insert_one({
            "name": req_json.get("name"),
            "description": req_json.get("description"),
            "welcome_message": req_json.get("welcome_message"),
            "personality_traits": req_json.get("personality_traits"),
            "expertise_docs": list(map(
                lambda x: ObjectId(x),
                req_json.get("expertise_docs")
            )),
            "whitelist_domains": req_json.get("whitelist_domains"),
            "created_by": clerk_user.id
        })
        
        logger.debug("Insert Chatbot result: {}", ins)
        
        response = Response(
            json.dumps({
                "chatbot_data_url": f"{os.getenv('API_URL')}/chatbot/{ins.inserted_id}"
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )
        
        return response
        
    except Exception as e:
        logger.error("Error while inserting a chatbot: {}", e)
        
        if "E11000 duplicate key error" in str(e) and "name_1_created_by_1" in str(e):
            response = Response(
                json.dumps({
                    "message" : f"You already have a chatbot with name '{req_json['name']}'!"
                }),
                status=400,
                headers={"Content-Type": "application/json"}    
            )
        else:
            response = Response(
                json.dumps({"message" : "Internal Error"}),
                status=500,
                headers={"Content-Type": "application/json"}    
            )
        return response