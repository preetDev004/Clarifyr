from loguru import logger
from utils.mongodb import connect_to_db
from app import app

# Route imports
import routes.expertise_data
import routes.signup
import routes.get_user
import routes.chatbot_interface

if __name__ == '__main__':
    connect_to_db()
    logger.info("Server now running on port 3000!")
    app.run(debug=True, host="0.0.0.0", port=3000)