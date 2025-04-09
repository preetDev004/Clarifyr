from __main__ import app
from flask import request, make_response
from loguru import logger
import os

from utils.template import read_html_template, insert_templates
from utils.js_obfuscator import obfuscate_js

STATIC_FOLDER = 'chatbot-interface-static'
FILENAME = 'main.js'

@app.route("/chatbot_interface", methods=['GET'])
def get_chatbot_interface():
	logger.info("GET /chatbot_interface hit!")

	# Get chatbot ID
	cid = request.args.get("cid")
	logger.debug(f"Chatbot ID: {cid}")

	# Get chatbot script path
	static_files_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', STATIC_FOLDER))
	file_path = os.path.join(static_files_dir, FILENAME)

	# Read the JS file content
	with open(file_path, 'r') as f:
		js_content = f.read()

	js_content = insert_templates(js_content, {
		"OPEN_CHAT_BUTTON": read_html_template('chat-button', {}),
		"CHAT_WINDOW": read_html_template('chat-window', {})
	})

	js_content = obfuscate_js(js_content)

	# Create a response and set headers to serve as a JS file
	response = make_response(js_content)
	response.headers['Content-Type'] = 'application/javascript'
	return response
