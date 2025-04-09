import pytest
import requests
from datetime import datetime
from bson import ObjectId
from conftest import get_database

BASE_URL = "http://localhost:3000"
SESSION_ID = "sess_2vSeCI4emZZfIMOCbUnCazwJUgk"
USER_ID = "user_2umMsXVm6zvIqECbVKtygzjtrJO"

@pytest.fixture
def headers():
    """Fixture providing headers with the Clerk SessionID."""
    return {"SessionID": SESSION_ID}
    
# POST /chatbot
@pytest.mark.order(8)
def test_create_chatbot_success(headers):
    db = get_database()
    
    db["users"].insert_one({
        "user_id": USER_ID,
        "email_address": "3bochoz3@gmail.com"
    })
    
    doc1 = db["documents"].insert_one({
        "name": "doc1.txt",
        "user_id": USER_ID,
        "content": "Test content 1",
        "type": "text/plain",
        "size": 100,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    doc2 = db["documents"].insert_one({
        "name": "doc2.txt",
        "user_id": USER_ID,
        "content": "Test content 2",
        "type": "text/plain",
        "size": 200,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    
    chatbot_data = {
        "name": "Test Chatbot",
        "description": "A test chatbot",
        "welcome_message": "Hello!",
        "personality_traits": ["Friendly", "Helpful"],
        "expertise_docs": [str(doc1.inserted_id), str(doc2.inserted_id)],
        "whitelist_domains": ["localhost:8080"]
    }
    
    response = requests.post(f"{BASE_URL}/chatbot", headers=headers, json=chatbot_data)
    
    assert response.status_code == 200
    assert "chatbot_data_url" in response.json()
    
    chatbot_id = response.json()["chatbot_data_url"].split("/")[-1]
    chatbot = db["chatbots"].find_one({"_id": ObjectId(chatbot_id)})
    
    assert chatbot is not None
    assert chatbot["name"] == "Test Chatbot"
    assert chatbot["description"] == "A test chatbot"
    assert chatbot["welcome_message"] == "Hello!"
    assert chatbot["personality_traits"] == ["Friendly", "Helpful"]
    assert [str(doc) for doc in chatbot["expertise_docs"]] == [str(doc1.inserted_id), str(doc2.inserted_id)]
    assert chatbot["whitelist_domains"] == ["localhost:8080"]
    assert chatbot["created_by"] == USER_ID
    
@pytest.mark.order(9)
def test_create_chatbot_missing_required_fields(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    
    chatbot_data = {
        "description": "A test chatbot",
        "welcome_message": "Hello!",
        "personality_traits": ["Friendly"],
        "expertise_docs": [],
        "whitelist_domains": ["localhost:8080"]
    }
    
    response = requests.post(f"{BASE_URL}/chatbot", headers=headers, json=chatbot_data)

    assert response.status_code == 500
    assert response.json()["message"] == "Internal Error"
    
@pytest.mark.order(10)
def test_create_chatbot_invalid_expertise_docs(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    
    chatbot_data = {
        "name": "Invalid Chatbot",
        "expertise_docs": ["invalid_id"],
        "whitelist_domains": ["localhost:8080"]
    }
    
    response = requests.post(f"{BASE_URL}/chatbot", headers=headers, json=chatbot_data)
    
    assert response.status_code == 400
    assert response.json()["message"] == "Invalid Document ID provided for Expertise Docs"
    
@pytest.mark.order(11)
def test_create_chatbot_duplicate_name(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    db["chatbots"].insert_one({
        "name": "Duplicate Chatbot",
        "created_by": USER_ID,
        "expertise_docs": [],
        "whitelist_domains": ["localhost:8080"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    
    chatbot_data = {
        "name": "Duplicate Chatbot",
        "expertise_docs": [],
        "whitelist_domains": ["localhost:8080"]
    }
    
    response = requests.post(f"{BASE_URL}/chatbot", headers=headers, json=chatbot_data)
    
    assert response.status_code == 400
    assert response.json()["message"] == "You already have a chatbot with name 'Duplicate Chatbot'!"
    
@pytest.mark.order(12)
def test_create_chatbot_no_session_id():
    chatbot_data = {
        "name": "No Auth Chatbot",
        "expertise_docs": [],
        "whitelist_domains": ["localhost:8080"]
    }
    
    response = requests.post(f"{BASE_URL}/chatbot", json=chatbot_data)
    
    assert response.status_code == 400
    assert response.json()["message"] == "No Authentication Details Provided"

    
# GET /chatbots
@pytest.mark.order(13)
def test_get_chatbots_success(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    db["chatbots"].insert_many([
        {
            "name": "Chatbot1",
            "created_by": USER_ID,
            "expertise_docs": [],
            "whitelist_domains": ["domain1"],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "name": "Chatbot2",
            "created_by": USER_ID,
            "expertise_docs": [],
            "whitelist_domains": ["domain2"],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ])
    
    response = requests.get(f"{BASE_URL}/chatbots", headers=headers)
    
    assert response.status_code == 200
    chatbots = response.json()
    assert len(chatbots) == 2
    assert chatbots[0]["name"] == "Chatbot1"
    assert chatbots[1]["name"] == "Chatbot2"
    assert all(chatbot["created_by"] == USER_ID for chatbot in chatbots)
    assert all("id" in chatbot and "_id" not in chatbot for chatbot in chatbots)
    
@pytest.mark.order(14)
def test_get_chatbots_no_chatbots(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    
    response = requests.get(f"{BASE_URL}/chatbots", headers=headers)
    
    assert response.status_code == 200
    assert response.json() == []
    
@pytest.mark.order(15)
def test_get_chatbots_no_session_id():
    response = requests.get(f"{BASE_URL}/chatbots")
    
    assert response.status_code == 400
    assert response.json()["message"] == "No Authentication Details Provided"
    
# GET /chatbot/<chatbot_id>
@pytest.mark.order(16)
def test_get_chatbot_success(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    chatbot = db["chatbots"].insert_one({
        "name": "Specific Chatbot",
        "created_by": USER_ID,
        "expertise_docs": [],
        "whitelist_domains": ["localhost:8080"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    chatbot_id = str(chatbot.inserted_id)
    
    response = requests.get(f"{BASE_URL}/chatbot/{chatbot_id}", headers=headers)
    
    assert response.status_code == 200
    assert response.json()["name"] == "Specific Chatbot"
    assert response.json()["id"] == chatbot_id
    assert "_id" not in response.json()
    
@pytest.mark.order(17)
def test_get_chatbot_not_found(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    invalid_id = "123123123123123123123123"
    
    response = requests.get(f"{BASE_URL}/chatbot/{invalid_id}", headers=headers)
    
    assert response.status_code == 404
    assert response.json()["message"] == f"No chatbot with ID '{invalid_id}' found!"
    
@pytest.mark.order(18)
def test_get_chatbot_invalid_id(headers):
    response = requests.get(f"{BASE_URL}/chatbot/123", headers=headers)
    
    assert response.status_code == 400
    assert response.json()["message"] == "Invalid Chatbot ID"

# PATCH /chatbot/<chatbot_id>
@pytest.mark.order(20)
def test_patch_chatbot_success(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    chatbot = db["chatbots"].insert_one({
        "name": "Update Chatbot",
        "description": "Original Desc",
        "welcome_message": "",
        "created_by": USER_ID,
        "expertise_docs": [],
        "whitelist_domains": ["original.domain"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    chatbot_id = str(chatbot.inserted_id)
    
    update_data = {
        "description": "Updated Desc",
        "welcome_message": "Updated Welcome",
        "name": "Should Not Change"
    }
    
    response = requests.patch(f"{BASE_URL}/chatbot/{chatbot_id}", headers=headers, json=update_data)
    
    assert response.status_code == 200
    updated_chatbot = response.json()
    assert updated_chatbot["description"] == "Updated Desc"
    assert updated_chatbot["welcome_message"] == "Updated Welcome"
    assert updated_chatbot["name"] == "Update Chatbot"
    assert updated_chatbot["created_by"] == USER_ID
    
@pytest.mark.order(21)
def test_patch_chatbot_forbidden_fields(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    chatbot = db["chatbots"].insert_one({
        "name": "Forbidden Chatbot",
        "created_by": USER_ID,
        "expertise_docs": [],
        "whitelist_domains": ["domain"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    chatbot_id = str(chatbot.inserted_id)
    
    update_data = {
        "name": "New Name",
        "created_by": "another_user"
    }
    
    response = requests.patch(f"{BASE_URL}/chatbot/{chatbot_id}", headers=headers, json=update_data)
    
    assert response.status_code == 200
    assert response.json()["name"] == "Forbidden Chatbot"
    assert response.json()["created_by"] == USER_ID
    
@pytest.mark.order(22)
def test_patch_chatbot_invalid_expertise_docs(headers):
    db = get_database()
    db["users"].insert_one({"user_id": USER_ID, "email_address": "3bochoz3@gmail.com"})
    chatbot = db["chatbots"].insert_one({
        "name": "Invalid Update Chatbot",
        "created_by": USER_ID,
        "expertise_docs": [],
        "whitelist_domains": ["domain"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    chatbot_id = str(chatbot.inserted_id)
    
    update_data = {
        "expertise_docs": ["invalid_id"]
    }
    
    response = requests.patch(f"{BASE_URL}/chatbot/{chatbot_id}", headers=headers, json=update_data)
    
    assert response.status_code == 400
    assert response.json()["message"] == "Invalid Document ID provided for Expertise Docs"
    
@pytest.mark.order(23)
def test_patch_chatbot_not_found(headers):
    invalid_id = "123123123123123123123123"
    update_data = {"description": "Trying to update"}
    
    response = requests.patch(f"{BASE_URL}/chatbot/{invalid_id}", headers=headers, json=update_data)
    
    assert response.status_code == 404
    assert response.json()["message"] == f"No chatbot with ID '{invalid_id}' found!"
    
@pytest.mark.order(24)
def test_patch_chatbot_no_session_id():
    chatbot_id = "123123123123123123123123"
    update_data = {"description": "No auth update"}
    
    response = requests.patch(f"{BASE_URL}/chatbot/{chatbot_id}", json=update_data)
    
    assert response.status_code == 400
    assert response.json()["message"] == "No Authentication Details Provided"