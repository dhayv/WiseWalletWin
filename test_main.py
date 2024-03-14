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

# access token 
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

    # Try to get the user income again
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

# income info 
@pytest.fixture(scope="function")
def income_info(client: TestClient, test_access_token: str, create_test_user: Dict[str, Any]) -> None:
    id_user = create_test_user['id']
    response = client.post(f"/income/{id_user}", 
        json={"amount": 5000,
            "recent_pay": "03-01-2024",
            "last_pay": "02-16-2024",
    }, headers={"Authorization": f"bearer {test_access_token}"})
    assert response.status_code == 201
    return response.json()

def test_add_income(client: TestClient, test_access_token: str, create_test_user: Dict[str, Any]) -> None:
    id_user = create_test_user['id']
    response = client.post(f"/income/{id_user}", json={
        "amount": 5000,
        "recent_pay": "03-01-2024",
        "last_pay": "02-16-2024",
    }, headers={"Authorization": f"bearer {test_access_token}"})

    assert response.status_code == 201
    user_income = response.json()
    assert user_income["amount"] == 5000
    assert user_income["recent_pay"] == "2024-03-01"
    assert user_income["last_pay"] == "2024-02-16"
    assert user_income["user_id"] == id_user
    assert "id" in user_income

    # Optional: GET request to verify the income data is correctly associated with the user
    get_response = client.get(
        f"/income/{id_user}",
        headers={"Authorization": f"Bearer {test_access_token}"}
    )
    assert get_response.status_code == 200
    get_response_data = get_response.json()

    # Verify the income data in the GET response
    # This assumes the GET endpoint returns a list of incomes
    assert len(get_response_data) > 0
    assert get_response_data[0]['user_id'] == id_user
    assert get_response_data[0]['amount'] == user_income['amount']

def test_get_income(client: TestClient, test_access_token, create_test_user: Dict[str, Any], income_info,):
    id_user = create_test_user['id']
    response = client.get(f"/income/{id_user}", headers={"Authorization": f"bearer {test_access_token}"})


    data = response.json()
    assert len(data) > 0
    data = data[0]
    assert response.status_code == 200
    assert data["amount"]== 5000
    assert data["recent_pay"]== "2024-03-01"
    assert data["last_pay"]== "2024-02-16"
    assert data["user_id"]== id_user

def test_update_income(client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]) -> None:
    income_id = income_info['id']
    response = client.put(f"/income/{income_id}", json={"amount": 6000, "recent_pay": "03-12-2024"},headers={"Authorization": f"bearer {test_access_token}"} )

    assert response.status_code == 200, response.text
    data = response.json()

    print(response.json())
    assert data["amount"] == 6000
    assert data["recent_pay"] == "2024-03-12"
    assert data["last_pay"] == income_info['last_pay']

def test_delete_income(client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]) -> None:
    income_id = income_info['id']
    response = client.delete(f"/income/{income_id}", headers={"Authorization": f"bearer {test_access_token}"})

    assert response.status_code == 204, f"Expected status code 204 but received {response.status_code}"
    assert response.status_code == 204, response.text
    # Try to get the user income again
    response = client.get(f"/income/{income_id}")
    assert response.status_code == 404, response.text
    assert response.json() == {"detail": "Item not found"}

def test_post_expense(client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]):
    income_id = income_info['id']
    response = client.post(f"/expenses/{income_id}",json={"name": "Water Bill", "amount":50, "due_date":15}, 
        headers = {"Authorization": f"bearer {test_access_token}"})
    assert response.status_code == 201
    data = response.json()

    assert response.status_code == 201, f"Expected status code 201 but received {response.status_code}"
    assert response.status_code == 201, response.text

    assert data["name"] == "Water Bill"
    assert data["amount"] == 50
    assert data["due_date"] == 15
    assert "id" in data




