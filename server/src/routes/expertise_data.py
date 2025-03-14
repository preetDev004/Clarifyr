from __main__ import app
import os

from flask import request
from loguru import logger

from utils.file import extract_file_data, validate_file

@app.route("/upload_data", methods=["POST"])
def upload_data():
	logger.info("POST /upload_data route hit!")
	data = None

	# Get request Content-Type
	content_type = request.headers.get("Content-Type")
	logger.debug(f"Content-Type: {content_type}")

	# Get save parameter
	save = request.args.get("save")
	logger.debug(f"save: {save}")

	if not content_type:
		logger.error("No Content-Type provided")
		return "No Content-Type provided", 400

	if content_type.find("text/plain") != -1:
		# Get request data
		data = {
			"name": "text data",
			"type": "text",
			"data": request.data.decode("utf-8")
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
				return message, 400


			# Print file name and extension
			logger.debug(f"multipart/form-data data uploaded")
			logger.debug(f"File name: {data['name']}, File extension: {data['type']}, File size: {len(data['data'])}")

			# Delete the file if save is not true
			if save != "true":
				os.remove(data["full-path"])
				logger.debug(f"File deleted: {data['full-path']}")
				
	else:
		logger.error("Invalid Content-Type")
		return "Invalid Content-Type", 400
    
	if not data or not data["data"]:
		logger.error("No data uploaded")
		return "No data uploaded", 400
	
	if len(data["data"]) > 200:
		logger.debug(
			f"Uploaded data: \n {data['data'][:200]}...\n\n...\n\n {data['data'][-200:]}", 
		)
	else:
		logger.debug(f"Data: {data['data']}")


	return "Data uploaded successfully!"