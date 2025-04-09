from __main__ import app
from bson import ObjectId
from flask import Response, request, make_response
from loguru import logger
import os
import json
from urllib.parse import urlparse

from utils.template import read_html_template, insert_templates
from utils.js_obfuscator import obfuscate_js
from utils.mongodb import get_database
from routes.chatbots import chatbot_projection

STATIC_FOLDER = 'chatbot-interface-static'
FILENAME = 'main.js'

@app.route("/chatbot_interface", methods=['GET'])
def get_chatbot_interface():
	logger.info("GET /chatbot_interface hit!")

	# Get chatbot ID
	cid = request.args.get("cid")
	logger.debug(f"Chatbot ID: {cid}")

	# Get the domain
	origin = request.headers.get('Origin')
	referer = request.headers.get('Referer')

	# Use Origin first, fall back to Referer
	url = origin or referer
	domain = None

	if url:
		parsed_url = urlparse(url)
		domain = parsed_url.netloc  # This gives 'example.com' or 'example.com:port'

	logger.debug(f"Request domain: {domain}")

	collection = get_database()["chatbots"]

	chatbot=None
    
	# fetch the target chatbot
	try:
		chatbot = collection.find_one({
			"_id": ObjectId(cid),
		}, chatbot_projection)
		logger.debug("found a chatbot: \n{}", chatbot)
		
		if not chatbot:
			response = Response(
				json.dumps({"message": f"No chatbot with ID \'{cid}\' found!"}),
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
	
	# Check whitelist
	if domain not in chatbot["whitelist_domains"]:
		return Response(
			json.dumps({"message": "Domain not allowed"}),
			status=403,
			headers={"Content-Type": "application/json"}
		)

	# Get chatbot script path
	static_files_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', STATIC_FOLDER))
	file_path = os.path.join(static_files_dir, FILENAME)

	# Read the JS file content
	with open(file_path, 'r') as f:
		js_content = f.read()

	js_content = insert_templates(js_content, {
		"OPEN_CHAT_BUTTON": read_html_template('chat-button', {}),
		"CHAT_WINDOW": read_html_template('chat-window', {
			"BOT_NAME": chatbot["name"],
			"WELCOME_MESSAGE": chatbot["welcome_message"]
		})
	})

	js_content = obfuscate_js(js_content)

	# Create a response and set headers to serve as a JS file
	response = make_response(js_content)
	response.headers['Content-Type'] = 'application/javascript'
	return response
