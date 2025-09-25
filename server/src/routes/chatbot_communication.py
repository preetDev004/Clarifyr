from __main__ import app
from bson import ObjectId
from flask import Response, request, make_response
from loguru import logger
from datetime import datetime
import uuid
import json

from utils.mongodb import get_database
from utils.md_to_html import md_to_html
from utils.safe_text import safe_text
from utils.generate_response import generate_response

HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization"
}

@app.route("/start_new_chat", methods=['OPTIONS'])
def start_new_chat_options():
	"""Handle CORS preflight requests"""
	return Response(
		status=200,
		headers=HEADERS
	)

@app.route("/start_new_chat", methods=['GET'])
def start_new_chat():
	logger.info("GET /start_new_chat hit!")

	chatbot_id = request.args.get("cid")

	collection = get_database()["chats"]

	ins = collection.insert_one({
		"created_at": datetime.now(),
		"chatbot_id": ObjectId(chatbot_id)
	})

	return Response(
		json.dumps({
			"uuid": str(ins.inserted_id)
		}),
		status=200,
		headers=HEADERS
	)

@app.route("/send_message", methods=['OPTIONS'])
def send_message_options():
	"""Handle CORS preflight requests"""
	return Response(
		status=200,
		headers=HEADERS
	)
    
@app.route("/send_message", methods=['POST'])
def send_message():
	logger.info("POST /send_message hit!")

	message = request.json.get("message")
	chat_id = request.json.get("chat_id")

	message = safe_text(message)

	collection = get_database()["messages"]

	ins = collection.insert_one({
		"created_at": datetime.now(),
		"chat_id": ObjectId(chat_id),
		"message": message,
		"role": "user"
	})

	res = generate_response(message, chat_id)

	return Response(
		json.dumps({"message": res}),
		status=200,
		headers=HEADERS
	)

@app.route("/get_messages", methods=['GET'])
def get_messages():
	logger.info("GET /get_messages hit!")

	chat_id = request.args.get("chat_id")

	collection = get_database()["messages"]

	messages = list(collection.find({"chat_id": ObjectId(chat_id)}))
	for message in messages:
		message["_id"] = str(message["_id"])
		message["created_at"] = message["created_at"].isoformat()
		message["chat_id"] = str(message["chat_id"])
		message["message"] = md_to_html(message["message"])
	
	return Response(
		json.dumps({"messages": messages}),
		status=200,
		headers=HEADERS
	)