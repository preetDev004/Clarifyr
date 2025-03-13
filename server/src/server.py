from flask import Flask
from flask import request
from loguru import logger

from utils.file import extract_file_data, validate_file

app = Flask(__name__)

@app.route("/")
def hello_world():
    logger.info("GET / route hit!")
    return "Hello World"

@app.route("/upload_data", methods=["POST"])
def upload_data():
    logger.info("POST /upload_data route hit!")
    data = None

    # Get request Content-Type
    content_type = request.headers.get("Content-Type")
    logger.debug(f"Content-Type: {content_type}")

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

        logger.debug(f"text/plain data uploaded: {data}")
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
    else:
        logger.error("Invalid Content-Type")
        return "Invalid Content-Type", 400
    
    if not data:
        logger.error("No data uploaded")
        return "No data uploaded", 400

    return "Data uploaded successfully!"

if __name__ == '__main__':
    logger.info("Server now running on port 3000!")
    app.run(debug=True, host="0.0.0.0", port=3000)