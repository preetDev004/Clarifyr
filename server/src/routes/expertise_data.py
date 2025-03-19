from __main__ import app
import os
import uuid
from datetime import datetime
import threading

from flask import request, Response, json
from loguru import logger

from utils.file import extract_file_data, validate_file, preprocess_data, nltk_chunking
from utils.clerk import get_clerk_user_from_session
from utils.mongodb import get_mongo_client

@app.route("/upload_data", methods=['POST'])
def upload_data():
	logger.info("POST /upload_data route hit!")
	data = None

	# Get user session
	session_id = request.headers.get('SessionID')
	# If no SessionID provided, respond with Bad Request
	if not session_id:
		return Response(
			json.dumps({"message": "No Authentication Details Provided"}),
			status=401,
			headers={
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://localhost:3000"
			}
		)
	# if SessionID is provided, get the Clerk's user id from it
	user = get_clerk_user_from_session(session_id=session_id)
	logger.debug("User ID from request: {}", user.id)
	logger.debug("User Object: {}", user)

	# Get request Content-Type
	content_type = request.headers.get("Content-Type")
	logger.debug(f"Content-Type: {content_type}")

	# Get save parameter
	save = request.args.get("save")
	logger.debug(f"save: {save}")

	if not content_type:
		logger.error("No Content-Type provided")
		return Response(
			json.dumps({"message": "No Content-Type provided"}),
			status=400,
			headers={
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://localhost:3000"
			}
		)

	if content_type.find("text/plain") != -1:
		# Get request data
		data = {
			"original-name": "",
			"name": str(uuid.uuid4()),
			"type": "text",
			"data": request.data.decode("utf-8"),
			"size": len(request.data)
		}

		logger.debug(f"text/plain data uploaded")
	elif content_type.find("multipart/form-data") != -1:
		# Get request data
		if "file" in request.files:
			file = request.files["file"]

			data = extract_file_data(file)
			val_res, message = validate_file(data)

			if not val_res:
				logger.error(message)
				return Response(
					json.dumps({"message": message}),
					status=400,
					headers={
						"Content-Type": "application/json"
					}
				)

			# Print file name and extension
			logger.debug(f"multipart/form-data data uploaded")
			logger.debug(f"File name: {data['name']}, File extension: {data['type']}, File size: {len(data['data'])}")

			# Delete the file if save is not true
			if save != "true":
				os.remove(data["full-path"])
				logger.debug(f"File deleted: {data['full-path']}")
				
	else:
		logger.error("Invalid Content-Type")
		return Response(
			json.dumps({"message": "Invalid Content-Type"}),
			status=400,
			headers={
				"Content-Type": "application/json"
			}
		)
    
	if not data or not data["data"]:
		logger.error("No data uploaded")
		return Response(
			json.dumps({"message": "No data uploaded"}),
			status=400,
			headers={
				"Content-Type": "application/json"
			}
		)
	
	data["original-data"] = data["data"]
	data["data"] = preprocess_data(data["data"])
	data_text = ' '.join(data["data"])

	logger.debug(f"Preprocessed done: Orig: {len(data['original-data'])} bytes, Preprocessed: {len(data_text)} bytes")
	
	if len(data_text) > 200:
		logger.debug(
			f"Data: \n {data_text[:200]}...\n\n...\n\n {data_text[-200:]}", 
		)
	else:
		logger.debug(f"Data: {data_text}")

	# insert the new document in mongodb database
	collection = get_mongo_client()["main"]["documents"]

	ins = collection.insert_one({
		"name": data["name"],
		"original_name": data["original-name"],
		"user_id": user.id,
		"content": data["original-data"],
		"type": data["type"],
		"size": data["size"],
		"status": "processing",
		"created_at": datetime.now(),
		"updated_at": datetime.now()
	})

	logger.debug('Insert document result: {}', ins)

	# Start chunking in a new thread to avoid response delays
	thread = threading.Thread(target=nltk_chunking, args=(data["data"], data["name"], 128))
	thread.start()

	return Response(
			json.dumps({"message": "Data uploaded successfully!"}),
			status=200,
			headers={
				"Content-Type": "application/json"
			}
		)