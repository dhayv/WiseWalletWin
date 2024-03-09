from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from main import app  # Import your FastAPI instance
from database import get_db
from models import Users, Income, Expense 
from auth import authenticate_user, get_user
from unittest.mock import Mock

# Configure your test database and override get_db dependency
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

def override_get_db():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_login_and_get_token():
    response = client.post("/token", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None
    return token

def test_read_current_user():
    token = test_login_and_get_token()
    response = client.get("/user/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

# Example of testing a protected POST endpoint
def test_create_resource_with_auth():
    token = test_login_and_get_token()
    response = client.post(
        "/protected-resource",
        json={"data": "value"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"] == "value"


def test_create_user():
    response = client.post("/user", json={"username": "testuser", "email": "test@example.com", "password": "securepassword"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert "id" in response.json()

def test_read_user_me():
    # This requires a user to be logged in, so it's a bit more complex to test without setting up authentication.
    pass

def test_read_user():
    user_id = 1  # Assuming there's a user with ID 1
    response = client.get(f"/user/{user_id}")
    assert response.status_code == 200
    assert response.json()["id"] == user_id

def test_update_user():
    user_id = 1  # Assuming there's a user with ID 1
    response = client.put(f"/user/{user_id}", json={"username": "updateduser"})
    assert response.status_code == 200
    assert response.json()["username"] == "updateduser"

def test_delete_user():
    user_id = 1  # Assuming there's a user with ID 1
    response = client.delete(f"/user/{user_id}")
    assert response.status_code == 204

def test_add_income():
    response = client.post("/income", json={"amount": 1000, "recent_pay": "2023-03-01", "last_pay": "2023-02-15"})
    assert response.status_code == 200
    assert response.json()["amount"] == 1000

def test_read_all_incomes():
    response = client.get("/income")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_user():
    test_username = "testuser"
    test_user = Users(username=test_username, hashed_password="hashed_pwd")

    mock_session = Mock(Session)
    mock_session.exec().first.return_value = test_user  # Simulate finding the user

    result = get_user(mock_session, test_username)
    assert result == test_user

    mock_session.exec().first.return_value = None  # Simulate not finding the user
    result = get_user(mock_session, "nonexistentuser")
    assert result is None

def test_update_income():
    income_id = 1  # Assuming there's an income with ID 1
    response = client.put(f"/income/{income_id}", json={"amount": 2000})
    assert response.status_code == 200
    assert response.json()["amount"] == 2000

def test_delete_income():
    income_id = 1  # Assuming there's an income with ID 1
    response = client.delete(f"/income/{income_id}")
    assert response.status_code == 204

def test_add_expense():
    response = client.post("/expenses", json={"name": "Test Expense", "amount": 500, "due_date": 10})
    assert response.status_code == 200
    assert response.json()["name"] == "Test Expense"

def test_read_expenses():
    response = client.get("/expenses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_expense():
    expense_id = 1  # Assuming there's an expense with ID 1
    response = client.put(f"/expenses/{expense_id}", json={"amount": 750})
    assert response.status_code == 200
    assert response.json()["amount"] == 750

def test_delete_expense():
    expense_id = 1  # Assuming there's an expense with ID 1
    response = client.delete(f"/expenses/{expense_id}")
    assert response.status_code == 204
