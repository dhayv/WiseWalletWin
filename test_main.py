from typing import Dict, Any
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from main import app  # Import your FastAPI instance
from database import get_db
from datetime import date, datetime

# User data to be used in the tests
USER_DATA = {
        "username": "johndoe",
        "email": "johndoe@example.com",
        "first_name": "John",
        "phone_number": "123-456-7890",
        "password": "strongpassword"
    }


# session fixture to create a new database for each test
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False}, poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

# client fixture to override the get_db dependency
@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
        
    app.dependency_overrides[get_db] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

# user fixture to create a new user for each test
@pytest.fixture(scope="function")
def create_test_user(client: TestClient) -> Dict[str, Any]:
    response = client.post("/user", json=USER_DATA)
    assert response.status_code == 201
    user = response.json()
    return user


# Check if user is created
def test_add_user(create_test_user: Dict[str, Any]) -> None:
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


def test_read_user(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user['id']
    response = client.get(f"/user/{user_id}")
    assert response.status_code == 200
    user_data = response.json()

    for key in ["username", "email", "first_name", "phone_number"]:
        assert key in user_data
        assert user_data[key] == USER_DATA[key]
    assert "id" in user_data

def test_update_user_info(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user['id']
    response = client.put(f"/user/{user_id}", json={"first_name": "Jane", "email": "janedoe@example.com", "password": "newpasword"}, )
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["first_name"] == "Jane"
    assert data["email"] == "janedoe@example.com"
    assert data["phone_number"] == USER_DATA["phone_number"]
    assert "id" in data

def test_delete_user(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user['id']
    response = client.delete(f"/user/{user_id}")
    assert response.status_code == 204, response.text
    # Try to get the user again
    response = client.get(f"/user/{user_id}")
    assert response.status_code == 404, response.text
    assert response.json() == {"detail": "User not found"}



def test_add_income(client: TestClient, test_access_token: str, create_test_user: Dict[str, Any]) -> None:
    id_user = create_test_user['id']
    response = client.post(f"/income?user_id={id_user}", json={
        "amount": 5000,
        "recent_pay": "03-01-2024",
        "last_pay": "02-16-2024",
    }, headers={"Authorization": f"bearer {test_access_token}"})

    # Print the response if the status code is not what we expect
    if response.status_code != 201:
        print("Response status code:", response.status_code)
        print("Response JSON:", response.json())

    assert response.status_code == 201, f"Expected status code 201 but received {response.status_code}"
    print(response.json()) 

    user_income = response.json()
    assert user_income["amount"] == 5000
    assert user_income["recent_pay"] == "2024-03-01"
    assert user_income["last_pay"] == "2024-02-16"
    assert user_income["user_id"] == id_user
    assert "id" in user_income




