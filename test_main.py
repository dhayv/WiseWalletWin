from typing import Dict, Any
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from main import app  # Import your FastAPI instance
from database import get_db
from models import Users, Income, Expense 
from auth import authenticate_user, get_user
from unittest.mock import Mock


USER_DATA = {
        "username": "johndoe",
        "email": "johndoe@example.com",
        "first_name": "John",
        "phone_number": "123-456-7890",
        "password": "strongpassword"
    }

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

@pytest.fixture(scope="function")
def create_test_user(client: TestClient) -> Dict[str, Any]:
    response = client.post("/user", json=USER_DATA)
    assert response.status_code == 201
    user = response.json()
    return user


# Check if user is created
def test_create_user(create_test_user: Dict[str, Any]) -> None:
    user = create_test_user
    assert user["username"] == USER_DATA['username']
    assert user["email"] == USER_DATA['email']
    assert user["first_name"] == USER_DATA['first_name']
    assert user["phone_number"] == USER_DATA['phone_number']
    assert "id" in user

@pytest.fixture(scope="function")
def test_access_token(client: TestClient, create_test_user: Dict[str, Any]) -> str:
    response = client.post(
        "/token", data={
            "username": USER_DATA['username'],
            "password": USER_DATA['password']
          })
    token = response.json().get("access_token")
    assert response.status_code == 200
    assert token is not None
    return token


def test_read_user_me(client: TestClient, test_access_token: str) -> None:
    response = client.get(
        "/user/me", 
        headers={"Authorization": f"bearer {test_access_token}"}
    )
    assert response.status_code == 200
    user_data = response.json()
    assert 'username' in user_data
    assert user_data["username"] == USER_DATA['username']
    assert user_data["email"] == USER_DATA['email']
    assert user_data["first_name"] == USER_DATA['first_name']
    assert user_data["phone_number"] == USER_DATA['phone_number']
    assert "id" in user_data
    return user_data

def test_read_user(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user['id']
    response = client.get(f"/user/{user_id}")
    assert response.status_code == 200
    user_data = response.json()
    assert 'username' in user_data
    assert user_data["username"] == USER_DATA['username']
    assert user_data["email"] == USER_DATA['email']
    assert user_data["first_name"] == USER_DATA['first_name']
    assert user_data["phone_number"] == USER_DATA['phone_number']
    assert "id" in user_data