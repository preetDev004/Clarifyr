import pytest
import requests
from conftest import get_database

BASE_URL = "http://localhost:3000"
SESSION_ID = "sess_2vSeCI4emZZfIMOCbUnCazwJUgk"

@pytest.fixture
def headers():
    """Fixture providing headers with the Clerk SessionID."""
    return {"SessionID": SESSION_ID}

@pytest.mark.order(2)
def test_signup_success(headers):
    """Test successful signup with a valid SessionID."""
    response = requests.post(f"{BASE_URL}/signup", headers=headers)
    assert response.status_code == 200
    assert response.json()["user_data_url"] == f"{BASE_URL}/user/user_2umMsXVm6zvIqECbVKtygzjtrJO"

@pytest.mark.order(3)
def test_signup_no_session_id():
    """Test signup without SessionID header."""
    response = requests.post(f"{BASE_URL}/signup")
    assert response.status_code == 400
    assert response.json()["message"] == "No Authentication Details Provided"

@pytest.mark.order(4)
def test_signup_user_already_exists(headers):
    db = get_database()
    db["users"].insert_one({
        "user_id": "user_2umMsXVm6zvIqECbVKtygzjtrJO",
        "username": None,
        "first_name": None,
        "last_name": None,
        "email_address": "3bochoz3@gmail.com"
    })
    
    response = requests.post(f"{BASE_URL}/signup", headers=headers)
    assert response.status_code == 400
    assert response.json()["message"] == "This User already exists"