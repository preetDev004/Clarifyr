from app import app
from flask import request, Response, json
from loguru import logger
from utils.auth import get_clerk_user
from utils.mongodb import get_mongo_client
from bson import json_util

@app.route("/user/<user_id>", methods=['GET'])
def get_user(user_id):
    logger.info("GET /user/<user_id> hit!")
    response = None
    auth = get_clerk_user(request.headers)
    if not auth["successful"]:
        return auth["response"]
    clerk_user = auth["user"]
    
    # if requested user's id doesn't match with sender's id, 
    if user_id != clerk_user.id:
        response = Response(
            json.dumps({"message": "You are unauthorized to get this user's information"}),
            status=401,
            headers={"Content-Type": "application/json"}
        )
        return response
    
    # get user from mongodb
    collection = get_mongo_client()["main"]["users"]
    user = collection.find_one({"user_id": user_id})
    
    logger.info("found user: {}", user)
    
    # prepare a success response
    response = Response(
        json_util.dumps(user),
        status=200,
        headers={"Content-Type": 'application/json'}
    )
    
    return response
    
    