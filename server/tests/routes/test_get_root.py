import pytest
import requests

BASE_URL = "http://localhost:3000"

@pytest.mark.order(1)
def test_get_root():
    """Test that GET / returns 'Hello World'"""
    response = requests.get(BASE_URL)
    assert response.status_code == 200
    assert response.text == "Hello World"