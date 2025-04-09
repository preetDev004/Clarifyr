from __main__ import app
from flask import request, Response, json
from loguru import logger
import os
from utils.mongodb import get_database
from utils.auth import get_clerk_user

@app.route("/signup", methods = ["POST"])
def signup():
    logger.info("POST /signup hit!")
    response = None
    auth = get_clerk_user(request.headers)
    if not auth["successful"]:
        return auth["response"]
    
    user = auth["user"]
    
    # insert the new user in mongodb database
    collection = get_database()["users"]
    
    try:
        ins = collection.insert_one({
            "user_id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email_address": user.email_addresses[0].email_address,
        })
        
        logger.debug('Insert user result: {}', ins)
        
    except Exception as e:
        logger.error("Error while inserting a user: {}", e)
        if "E11000 duplicate key error" in str(e):
            response = Response(
                json.dumps({"message" : "This User already exists"}),
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
        
    
    # prepare a success response
    response = Response(
        json.dumps({
            "user_data_url": f"{os.getenv('API_URL')}/user/{user.id}"
        }),
        status=200,
        headers={
            "Content-Type": "application/json"
        }
    )
    return response