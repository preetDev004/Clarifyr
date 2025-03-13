import pytest
from src.server import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_root(client):
    """Test that GET / returns 'Hello World'"""
    response = client.get('/')
    assert response.data.decode('utf-8') == "Hello World"