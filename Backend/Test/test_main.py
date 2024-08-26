import sys
import time
from typing import Any, Dict, List
from unittest.mock import MagicMock, patch

import pytest
from data_base import database
from fastapi.security import SecurityScopes
from fastapi.testclient import TestClient
from main import app  # Import your FastAPI instance
from Services import email_client
from Services.auth import create_email_access_token
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool


def test_print_sys_path():
    print(sys.path)


# User data to be used in the tests
USER_DATA = {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "first_name": "John",
    "phone_number": "123-456-7890",
    "password": "Password123!",
}


# Session fixture to create a new database for each test
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


# Client fixture to override the get_db dependency
@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[database.get_db] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


# User fixture to create a new user for each test
@pytest.fixture(scope="function")
def create_test_user(client: TestClient) -> Dict[str, Any]:
    response = client.post("/api/user", json=USER_DATA)
    if response.status_code != 201:
        print(f"Failed to create user: {response.json()}")
    assert response.status_code == 201
    user = response.json()
    user["password"] = USER_DATA["password"]
    print(f"Created user: {user}")
    return user


# Mock email sending
@pytest.fixture(scope="session", autouse=True)
def mock_send_email():
    with patch.object(
        email_client.EmailService, "email_verification", new_callable=MagicMock
    ) as mock_email_verification:
        yield mock_email_verification


# Test email sent on user registration
def test_email_sent_on_user_registration(client: TestClient, mock_send_email):
    response = client.post("/api/user", json=USER_DATA)
    if response.status_code != 201:
        print(f"Failed to create user: {response.json()}")
    assert response.status_code == 201

    # Wait for the background task to complete
    time.sleep(1)  # Adjust sleep time as needed

    # Assert the email_verification method was called
    assert mock_send_email.called
    email_args, _ = mock_send_email.call_args
    email = email_args[0]
    token = email_args[1]

    # Decode the email to check its content
    print(f"Email sent to: {email}")
    print(f"Email token: {token}")
    assert email == USER_DATA["email"]


# Test email verification
def test_email_verification(
    client: TestClient, create_test_user: Dict[str, Any], mock_send_email
):
    token = create_email_access_token(create_test_user["email"])
    security_scopes = SecurityScopes(scopes=["email_verification"])
    response = client.get(
        f"/api/verify_email?token={token}", headers={"scopes": "email_verification"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Email verified successfully!"

    # Verify the user's status in the database
    user_response = client.get(f"/api/user/{create_test_user['id']}")
    user_data = user_response.json()
    assert user_data["is_email_verified"] is True


def test_email_verification_invalid_token(client: TestClient):
    invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1bnZhbGlkIiwic2NvcGUiOiJlbWFpbF92ZXJpZmljYXRpb24iLCJleHAiOjE2MDc5NTA1Nzl9.invalidsignature"
    response = client.get(f"/api/verify_email?token={invalid_token}")
    assert response.status_code == 403
    assert "Could not validate credentials" in response.json()["detail"]


def test_email_verification_already_verified(
    client: TestClient, create_test_user: Dict[str, Any]
):
    token = create_email_access_token(create_test_user["email"])
    response = client.get(f"/api/verify_email?token={token}")
    assert response.status_code == 200

    # Try to verify again
    response = client.get(f"/api/verify_email?token={token}")
    assert response.status_code == 400
    assert "Email already verified" in response.json()["detail"]


def test_add_user_with_existing_username(
    client: TestClient, create_test_user: Dict[str, Any]
) -> None:
    existing_user = create_test_user
    new_user_data = USER_DATA.copy()
    new_user_data["username"] = existing_user["username"]  # Use existing username
    new_user_data["email"] = "newemail@example.com"  # Use a new email to avoid conflict

    response = client.post("/api/user", json=new_user_data)
    assert response.status_code == 400
    assert "Username already exists" in response.json().get("detail", "")


def test_add_user_with_existing_email(
    client: TestClient, create_test_user: Dict[str, Any]
) -> None:
    existing_user = create_test_user
    new_user_data = USER_DATA.copy()
    new_user_data["username"] = "newusername"  # Use a new username to avoid conflict
    new_user_data["email"] = existing_user["email"]  # Use existing email

    response = client.post("/api/user", json=new_user_data)
    assert response.status_code == 400
    assert "Email already exists" in response.json().get("detail", "")


# Check if user is created
def test_add_user(create_test_user: Dict[str, Any]) -> None:
    user = create_test_user
    assert user["username"] == USER_DATA["username"]
    assert user["email"] == USER_DATA["email"]
    assert user["first_name"] == USER_DATA["first_name"]
    assert user["phone_number"] == USER_DATA["phone_number"]
    assert "id" in user


def test_add_user_with_invalid_password(client: TestClient) -> None:
    invalid_user_data = USER_DATA.copy()
    invalid_user_data["password"] = "weak"  # This should fail the regex validation
    response = client.post("/api/user", json=invalid_user_data)
    assert response.status_code == 422, response.json()
    print(response.json())


def test_add_user_with_invalid_phone(client: TestClient) -> None:
    invalid_user_data = USER_DATA.copy()
    invalid_user_data["phone_number"] = "1234567"

    response = client.post("/api/user", json=invalid_user_data)
    assert response.status_code == 422, response.json()
    print(response.json())


# access token
@pytest.fixture(scope="function")
def test_access_token(client: TestClient, create_test_user: Dict[str, Any]) -> str:
    token = create_email_access_token(create_test_user["email"])
    security_scopes = SecurityScopes(scopes=["email_verification"])
    print(f"Generated token: {token}")
    verify_response = client.get(
        f"/api/verify_email?token={token}", headers={"scopes": "email_verification"}
    )
    assert (
        verify_response.status_code == 200
    ), f"Verification failed: {verify_response.json()}"

    user_response = client.get(f"/api/user/{create_test_user['id']}")
    user_data = user_response.json()
    print(f"Post-verification user data: {user_data}")
    assert user_data["is_email_verified"], "Email verification status not updated"

    response = client.post(
        "/api/token",
        data={
            "username": create_test_user["username"],
            "password": create_test_user["password"],
        },
    )
    token = response.json().get("access_token")
    print(f"Access token: {token}")
    assert response.status_code == 200, f"Token generation failed: {response.json()}"
    assert token is not None
    return token


def test_read_user_me(client: TestClient, test_access_token: str) -> None:
    response = client.get(
        "/api/user/me", headers={"Authorization": f"bearer {test_access_token}"}
    )
    assert response.status_code == 200

    # Try to get the user income again
    user_data = response.json()
    assert "username" in user_data
    assert user_data["username"] == USER_DATA["username"]
    assert user_data["email"] == USER_DATA["email"]
    assert user_data["first_name"] == USER_DATA["first_name"]
    assert user_data["phone_number"] == USER_DATA["phone_number"]
    assert "id" in user_data


def test_read_user(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user["id"]
    response = client.get(f"/api/user/{user_id}")
    assert response.status_code == 200
    user_data = response.json()

    for key in ["username", "email", "first_name", "phone_number"]:
        assert key in user_data
        assert user_data[key] == USER_DATA[key]
    assert "id" in user_data


def test_update_user_info(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user["id"]
    response = client.put(
        f"/api/user/{user_id}",
        json={
            "first_name": "Jane",
            "email": "janedoe@example.com",
            "password": "newpasword",
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["first_name"] == "Jane"
    assert data["email"] == "janedoe@example.com"
    assert data["phone_number"] == USER_DATA["phone_number"]
    assert "id" in data


def test_delete_user(client: TestClient, create_test_user: Dict[str, Any]) -> None:
    user_id = create_test_user["id"]
    response = client.delete(f"/api/user/{user_id}")
    assert response.status_code == 204, response.text
    # Try to get the user again
    response = client.get(f"/api/user/{user_id}")
    assert response.status_code == 404, response.text
    assert response.json() == {"detail": "User account not found"}


# income info
@pytest.fixture(scope="function")
def income_info(
    client: TestClient, test_access_token: str, create_test_user: Dict[str, Any]
) -> None:
    id_user = create_test_user["id"]
    response = client.post(
        f"/api/income/{id_user}",
        json={
            "amount": 5000,
            "recent_pay": "03-01-2024",
            "last_pay": "02-16-2024",
        },
        headers={"Authorization": f"bearer {test_access_token}"},
    )
    assert response.status_code == 201
    return response.json()


def test_add_income(
    client: TestClient, test_access_token: str, create_test_user: Dict[str, Any]
) -> None:
    user_id = create_test_user["id"]
    income_data = {
        "amount": 5000,
        "recent_pay": "03-01-2024",
        "last_pay": "02-16-2024",
    }
    response = client.post(
        f"/api/income/{user_id}",
        json=income_data,
        headers={"Authorization": f"Bearer {test_access_token}"},
    )
    assert (
        response.status_code == 201
    ), f"Failed to add income, received status {response.status_code}"
    income_response = response.json()

    # Check if the returned income matches the submitted data
    assert (
        income_response["amount"] == income_data["amount"]
    ), "The returned amount does not match the expected amount"
    assert (
        income_response["recent_pay"] == "2024-03-01"
    ), "The returned recent pay date is incorrect"
    assert (
        income_response["last_pay"] == "2024-02-16"
    ), "The returned last pay date is incorrect"
    assert income_response["user_id"] == user_id, "The user ID does not match"

    # Optionally verify the income data by fetching it again
    get_response = client.get(
        f"/api/income/{user_id}",
        headers={"Authorization": f"Bearer {test_access_token}"},
    )
    assert get_response.status_code == 200, "Failed to fetch income details"
    income_data_fetched = get_response.json()[0]  # Assuming the GET returns a list
    assert (
        income_data_fetched["id"] == income_response["id"]
    ), "Income ID mismatch on retrieval"


def test_get_income(
    client: TestClient,
    test_access_token,
    create_test_user: Dict[str, Any],
    income_info,
):
    id_user = create_test_user["id"]
    response = client.get(
        f"/api/income/{id_user}",
        headers={"Authorization": f"bearer {test_access_token}"},
    )

    data = response.json()
    assert len(data) > 0
    data = data[0]
    assert response.status_code == 200
    assert income_info["amount"] == 5000
    assert income_info["recent_pay"] == "2024-03-01"
    assert income_info["last_pay"] == "2024-02-16"
    assert income_info["user_id"] == create_test_user["id"]

    assert "id" in income_info, "Income record does not have an ID"


def test_update_income(
    client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]
) -> None:
    income_id = income_info["id"]
    response = client.put(
        f"/api/income/{income_id}",
        json={"amount": 6000, "recent_pay": "03-12-2024"},
        headers={"Authorization": f"bearer {test_access_token}"},
    )

    assert response.status_code == 200, response.text
    data = response.json()

    print(response.json())
    assert data["amount"] == 6000
    assert data["recent_pay"] == "2024-03-12"
    assert data["last_pay"] == income_info["last_pay"]


def test_post_expense(
    client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]
):
    income_id = income_info["id"]
    response = client.post(
        f"/api/expenses/{income_id}",
        json={"name": "Water Bill", "amount": 50, "due_date": 15},
        headers={"Authorization": f"bearer {test_access_token}"},
    )
    assert response.status_code == 201
    data = response.json()

    assert (
        response.status_code == 201
    ), f"Expected status code 201 but received {response.status_code}"
    assert response.status_code == 201, response.text

    get_response = client.get(
        f"/api/expenses/{income_id}",
        headers={"Authorization": f"Bearer {test_access_token}"},
    )
    assert get_response.status_code == 200

    assert data["name"] == "Water Bill"
    assert data["amount"] == 50
    assert data["due_date"] == 15
    assert "id" in data


@pytest.fixture(scope="function")
def create_expenses(
    client: TestClient,
    income_info,
    test_access_token,
    create_test_user: Dict[str, Any],
    count: int = 2,
):
    expenses = []
    income_id = income_info["id"]
    for i in range(count):
        expense_data = {
            "name": f"Expense {i}",
            "amount": 50 * (i + 1),  # Just to have different amounts
            "due_date": 10 + i,  # Different due dates
        }
        response = client.post(
            f"/api/expenses/{income_id}",
            json=expense_data,
            headers={"Authorization": f"bearer {test_access_token}"},
        )
        assert response.status_code == 201
        expenses.append(response.json())

    return expenses


def test_get_expenses(
    client: TestClient,
    income_info,
    test_access_token,
    create_test_user: Dict[str, Any],
    create_expenses: List[Dict[str, Any]],
):
    income_id = income_info["id"]
    response = client.get(
        f"/api/expenses/{income_id}",
        headers={"Authorization": f"bearer {test_access_token}"},
    )

    expenses = response.json()

    assert response.status_code == 200
    assert isinstance(expenses, list)
    assert len(expenses) == len(
        create_expenses
    )  # Verify all created expenses are retrieved

    # Verify that each created expense is in the retrieved list
    for created_expense in create_expenses:
        assert any(expense["id"] == created_expense["id"] for expense in expenses)

    expense_id = expenses[0]["id"]
    print(f"{expense_id}")
    print(expenses)
    print(create_expenses)


def test_update_expense(
    client: TestClient,
    income_info,
    test_access_token,
    create_test_user: Dict[str, Any],
    create_expenses: List[Dict[str, Any]],
):
    # Targeting the first expense for update
    expense_id = create_expenses[0]["id"]

    # Update details
    update_data = {"name": "Food", "amount": 200}

    # Send the PUT request to update the expense
    response = client.put(
        f"/api/expenses/{expense_id}",
        json=update_data,
        headers={"Authorization": f"bearer {test_access_token}"},
    )

    assert response.status_code == 200

    # Fetch the updated expense
    get_response = client.get(
        f"/api/expenses/{income_info['id']}",
        headers={"Authorization": f"bearer {test_access_token}"},
    )
    expenses_after_update = get_response.json()

    # Verify the targeted expense is updated
    updated_expense = next(
        (exp for exp in expenses_after_update if exp["id"] == expense_id), None
    )
    assert updated_expense is not None
    assert updated_expense["name"] == update_data["name"]
    assert updated_expense["amount"] == update_data["amount"]

    # Verify that other expenses are not updated
    for exp in expenses_after_update:
        if exp["id"] != expense_id:
            assert exp["name"] != update_data["name"]
            assert exp["amount"] != update_data["amount"]

    print(updated_expense)
    print(exp)


def test_delete_expense(
    client: TestClient,
    income_info,
    test_access_token,
    create_test_user: Dict[str, Any],
    create_expenses: List[Dict[str, Any]],
):
    # Targeting the first expense to delete
    expense_id = create_expenses[0]["id"]
    response = client.delete(
        f"/api/expense/{expense_id}",
        headers={"Authorization": f"bearer {test_access_token}"},
    )

    # Try to get the user income again
    response = client.get(f"/api/expense/{expense_id}")
    assert response.status_code == 404, response.text
    assert response.json() == {"detail": "Not Found"}

    print(response.json())

    print(create_expenses)


def test_expenses_for_user(
    client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]
):
    user_id = create_test_user["id"]
    income_id = income_info["id"]

    multi_expenses = [
        {"name": "Rent", "amount": 1000, "due_date": 1},
        {"name": "Light Bill", "amount": 200, "due_date": 15},
        {"name": "Water Bill", "amount": 100, "due_date": 23},
    ]

    for expense in multi_expenses:
        response = client.post(
            f"/api/expenses/{income_id}",
            json=expense,
            headers={"Authorization": f"bearer {test_access_token}"},
        )
        assert response.status_code == 201

    get_response = client.get(
        f"/api/expenses/{income_id}",
        headers={"Authorization": f"Bearer {test_access_token}"},
    )
    assert get_response.status_code == 200

    data = get_response.json()
    print(data)
    assert len(data) == len(multi_expenses)
    for expense in data:
        assert expense["user_id"] == user_id


@pytest.fixture(scope="function")
def create_expenses_for_user(
    client: TestClient, income_info, test_access_token, create_test_user: Dict[str, Any]
):

    income_id = income_info["id"]

    expenses = [
        {"name": "Rent", "amount": 1000, "due_date": 1},
        {"name": "Insurance Bill", "amount": 200, "due_date": 15},
        {"name": "Water Bill", "amount": 100, "due_date": 23},
    ]

    for expense in expenses:
        response = client.post(
            f"/api/expenses/{income_id}",
            json=expense,
            headers={"Authorization": f"bearer {test_access_token}"},
        )
        assert response.status_code == 201


def test_total_expenses(
    create_expenses_for_user,
    client: TestClient,
    income_info,
    test_access_token,
    create_test_user: Dict[str, Any],
):
    user_id = create_test_user["id"]
    response = client.get(
        f"/api/user/{user_id}/total_expenses",
        headers={"Authorization": f"Bearer {test_access_token}"},
    )

    assert response.status_code == 200

    # Check the total expenses
    sum_of_expense = response.json()
    assert sum_of_expense["total_expenses"] == 1300

    print(response.json())


def test_income_minus_expenses(
    create_expenses_for_user,
    client: TestClient,
    income_info,
    test_access_token,
    create_test_user: Dict[str, Any],
):
    user_id = create_test_user["id"]
    response = client.get(
        f"/api/user/{user_id}/income_minus_expenses",
        headers={"Authorization": f"Bearer {test_access_token}"},
    )

    assert response.status_code == 200

    # Check the total expenses
    data = response.json()
    assert data["income_minus_expenses"] == 3700
    print(data)
