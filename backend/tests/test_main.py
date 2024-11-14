#Integration Testing
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    if response.status_code == 307:
        assert response.headers.get("location") == "/docs"
    else:
        assert response.status_code == 200
        assert "Swagger UI" in response.text
