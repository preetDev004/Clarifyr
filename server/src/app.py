from flask import Flask
from loguru import logger
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv('/server/.env')

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    logger.info("GET / route hit!")
    return "Hello World"
