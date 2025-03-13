from flask import Flask
from loguru import logger

app = Flask(__name__)

@app.route("/")
def hello_world():
    logger.info("GET / route hit!")
    return "Hello World"

# Route imports
import routes.expertise_data

if __name__ == '__main__':
    logger.info("Server now running on port 3000!")
    app.run(debug=True, host="0.0.0.0", port=3000)