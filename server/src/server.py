from flask import Flask
from loguru import logger
from dotenv import load_dotenv
from utils.mongodb import connect_to_db

load_dotenv('/server/.env')

app = Flask(__name__)

@app.route("/")
def hello_world():
    logger.info("GET / route hit!")
    return "Hello World"

import routes.signup

import routes.get_user

if __name__ == '__main__':
    connect_to_db()
    logger.info("Server now running on port 3000!")
    app.run(debug=True, host="0.0.0.0", port=3000)