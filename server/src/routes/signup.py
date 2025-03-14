from __main__ import app
from flask import request, Response, json
from loguru import logger
import os
from utils.clerk import get_clerk_user_from_session
from utils.mongodb import get_mongo_client

@app.route("/signup", methods = ["POST"])
def signup():
    logger.info("POST /signup hit!")
    response = None
    # Get the SessionID header
    session_id = request.headers.get('SessionID')
    # If no SessionID provided, respond with Bad Request
    if not session_id:
        response = Response(
            json.dumps({"message": "No Authentication Details Provided"}),
            status=400,
            headers={
                "Content-Type": "application/json"
            }
        )
        return response
    # if SessionID is provided, get the Clerk's user id from it
    user = get_clerk_user_from_session(session_id=session_id)
    logger.info("User ID from request: {}", user.id)
    logger.info("User Object: {}", user)
    
    # insert the new user in mongodb database
    collection = get_mongo_client()["main"]["users"]
    
    try:
        ins = collection.insert_one({
            "user_id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email_address": user.email_addresses[0].email_address,
        })
        
        logger.info('Insert user result: {}', ins)
        
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