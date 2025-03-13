from flask import Flask
from loguru import logger
from dotenv import load_dotenv
import os
from clerk_backend_api import Clerk

load_dotenv('/server/.env')

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

clerk_client = Clerk(bearer_auth=f'{CLERK_SECRET_KEY}')

res = clerk_client.sessions.get(session_id="sess_2uF9SUcGcR5HLP9XACW88UOU0Py")

assert res is not None

print(res)

logger.info("Clerk User Object:", res)

app = Flask(__name__)

@app.route("/")
def hello_world():
    logger.info("GET / route hit!")
    return "Hello World"

if __name__ == '__main__':
    logger.info("Server now running on port 3000!")
    app.run(debug=True, host="0.0.0.0", port=3000)