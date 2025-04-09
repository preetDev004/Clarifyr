from app import app
from flask import request, Response, json
from loguru import logger
from utils.auth import get_clerk_user
from utils.mongodb import get_database
from bson import json_util
from bson.objectid import ObjectId
import os
from pymongo import ReturnDocument
from datetime import datetime

chatbot_projection = {
    "_id": 0,
    "id": {"$toString": "$_id"},
    "name": 1,
    "description": 1,
    "welcome_message": 1,
    "personality_traits": 1,
    "expertise_docs": {
        "$map": {
            "input": "$expertise_docs",
            "as" : "doc_id",
            "in" : {"$toString": "$$doc_id"}
        }
    },
    "whitelist_domains": 1,
    "created_by": 1,
    "created_at": {"$toString": "$created_at"},
    "updated_at": {"$toString": "$updated_at"},
}

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
            "created_by": clerk_user.id,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
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
        elif "not a valid ObjectId" in str(e):
            response = Response(
                json.dumps({
                    "message" : "Invalid Document ID provided for Expertise Docs"
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
    



    
@app.route('/chatbots', methods=['GET'])
def get_user_chatbots():
    logger.info("GET /chatbots hit!")
    response = None
    auth = get_clerk_user(request.headers)
    if not auth["successful"]:
        return auth["response"]
    clerk_user = auth["user"]
    
    # fetch the user's chatbots from db
    collection = get_database()["chatbots"]
    
    try:
        chatbots = collection.find({"created_by": clerk_user.id}, chatbot_projection)
        logger.debug("found chatbots for user {}: \n{}", clerk_user.id, chatbots)
        
        response = Response(
            json_util.dumps(chatbots),
            status=200,
            headers={"Content-Type": "application/json"}
        )
        
        return response
    
    except Exception as e:
        logger.error("Error while fetching chatbots: {}", e)
               
        response = Response(
            json.dumps({"message" : "Internal Error"}),
            status=500,
            headers={"Content-Type": "application/json"}    
        )
        return response





    
@app.route('/chatbot/<chatbot_id>', methods=['GET', 'PATCH'])
def get_patch_chatbot(chatbot_id):
    response = None
    auth = get_clerk_user(request.headers)
    if not auth["successful"]:
        return auth["response"]
    clerk_user = auth["user"]
    
    collection = get_database()["chatbots"]
    
    chatbot=None
    
    # fetch the target chatbot
    try:
        chatbot = collection.find_one({
            "_id": ObjectId(chatbot_id),
            "created_by": clerk_user.id
        }, chatbot_projection)
        logger.debug("found a chatbot {}: \n{}", chatbot_id, chatbot)
        
        if not chatbot:
            response = Response(
                json.dumps({"message": f"No chatbot with ID \'{chatbot_id}\' found!"}),
                status=404,
                headers={"Content-Type": "application/json"} 
            )
            return response
        
    except Exception as e:
        logger.error("Error while fetching a chatbot: {}", e)
        
        if "not a valid ObjectId" in str(e):
            response = Response(
                json.dumps({"message" : "Invalid Chatbot ID"}),
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
    
    if request.method == 'GET':
        logger.info("GET /chatbot/<chatbot_id> hit!")
        response = Response(
            json_util.dumps(chatbot),
            status=200,
            headers={"Content-Type": "application/json"}    
        )
        return response
    
    elif request.method == 'PATCH':
        logger.info("PATCH /chatbot/<chatbot_id> hit!")
        # construct the update object from the request
        req_json = request.get_json()
        logger.debug("PATCH /chatbot/<chatbot_id> request JSON: \n{}", req_json)
        update_object = {"$set": {}}
        forbidden_for_change = ['name', "_id", "id", "created_by", "created_at", "updated_at"]
        for key, value in req_json.items():
            if key in chatbot and key not in forbidden_for_change and value:
                if key == 'expertise_docs':
                    try:
                        update_object["$set"][f"{key}"] = list(map(
                            lambda x: ObjectId(x), value
                        ))
                    except Exception as e:
                        logger.error("Error while preparing an update object: {}", e)
                        response = Response(
                            json.dumps({'message': 'Invalid Document ID provided for Expertise Docs'}),
                            status=400,
                            headers={"Content-Type": "application/json"}    
                        )
                        return response
                else:
                    update_object["$set"][f"{key}"] = value
        update_object["$set"]["updated_at"] = datetime.now()
        logger.debug("update object: \n{}",update_object)
        
        try:
            updated_chatbot = collection.find_one_and_update(
                {"_id": ObjectId(chatbot_id)},
                update_object,
                projection=chatbot_projection,
                return_document=ReturnDocument.AFTER
            )
            response = Response(
                json_util.dumps(updated_chatbot),
                status=200,
                headers={"Content-Type": "application/json"}    
            )
            return response
        except Exception as e:
            logger.error("Error while updating a chatbot: {}", e)
            response = Response(
                json.dumps({"message" : "Internal Error"}),
                status=500,
                headers={"Content-Type": "application/json"}    
            )
            return response