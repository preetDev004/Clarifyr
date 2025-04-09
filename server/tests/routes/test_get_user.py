import pytest
import requests
from utils.mongodb import get_mongo_client

BASE_URL = "http://localhost:3000"
SESSION_ID = "sess_2umNljXprzbOPAZwD8N4K8w8R20"
USER_ID = "user_2umMsXVm6zvIqECbVKtygzjtrJO"

@pytest.fixture
def headers():
    """Fixture providing headers with the Clerk SessionID."""
    return {"SessionID": SESSION_ID}

@pytest.mark.order(5)
def test_get_user_success(headers):
    """Test successful retrieval of user data with matching user_id."""
    response = requests.get(f"{BASE_URL}/user/{USER_ID}", headers=headers)
    assert response.status_code == 200
    assert response.json()["user_id"] == USER_ID
    assert response.json()["email_address"] == "3bochoz3@gmail.com"

@pytest.mark.order(6)
def test_get_user_no_session_id():
    """Test get user without SessionID header."""
    response = requests.get(f"{BASE_URL}/user/{USER_ID}")
    assert response.status_code == 400
    assert response.json()["message"] == "No Authentication Details Provided"

@pytest.mark.order(7)
def test_get_user_unauthorized(headers):
    """Test accessing a different user's data."""
    different_user_id = "user_different_id"
    response = requests.get(f"{BASE_URL}/user/{different_user_id}", headers=headers)
    assert response.status_code == 401
    assert response.json()["message"] == "You are unauthorized to get this user's information"