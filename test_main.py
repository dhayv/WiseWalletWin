import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from main import app  # Import your FastAPI instance
from database import get_db
from models import Users, Income, Expense 
from auth import authenticate_user, get_user
from unittest.mock import Mock
from starlette.testclient import WSGITransport


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
     

def test_create_expense(client: TestClient):
        response = client.post(
            "/expenses/", json={"name": "Food", "amount": 100, "due_date": 1}
        )
        data = response.json()
        print(response.status_code)
        print(data)

        assert response.status_code == 200
        assert 'name' in data, "Key 'name' not in response"
        assert data["name"] == "Food"
        assert data["amount"] == 100
        assert data["due_date"] == 1
        assert data["id"] is not None

#def test_create_expense_incomplete(client: TestClient):
#     respons
