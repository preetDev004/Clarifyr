from flask import Response, json
from utils.clerk import get_clerk_user_from_session
from loguru import logger

def get_clerk_user(headers):
    result = {
        "successful": None,
        'response': None,
        "user": None
    }
    # Get the SessionID header
    session_id = headers.get('SessionID')
    # If no SessionID provided, respond with Bad Request
    if not session_id:
        result["successful"] = False
        result["response"] = Response(
            json.dumps({"message": "No Authentication Details Provided"}),
            status=400,
            headers={
                "Content-Type": "application/json"
            }
        )
        return result
    # if SessionID is provided, get the Clerk's user id from it
    user = get_clerk_user_from_session(session_id=session_id)
    logger.info("User ID from request: {}", user.id)
    logger.info("User Object: {}", user)
    result["user"] = user
    result["successful"] = True
    return result