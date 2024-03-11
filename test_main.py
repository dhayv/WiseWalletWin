import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from main import app  # Import your FastAPI instance
from database import get_db
from models import Users, Income, Expense 
from auth import authenticate_user, get_user
from unittest.mock import Mock



@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False}, poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
        
    app.dependency_overrides[get_db] = get_session_override

    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
     
# Check if user is created
def test_create_user(client: TestClient):
        response = client.post(
            "/user", json={
        "username": "johndoe",
        "email": "johndoe@example.com",
        "first_name": "John",
        "phone_number": "123-456-7890",
        "password": "strongpassword"
        }
        )
        data = response.json()
        print(response.status_code)
        print(data)

        assert response.status_code == 201
        assert 'username' in data, "Key 'username' not in response"
        assert data["username"] == "johndoe"
        assert data["email"] == "johndoe@example.com"
        assert data["first_name"] == "John"
        assert data["phone_number"] == "123-456-7890"
        assert data["id"] is not None

