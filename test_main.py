import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from .main import app  # Import your FastAPI instance
from .database import get_db
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

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False}, poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


def test_create_expense(session: Session):
        def get_session_override():
            return session
        
        app.dependency_overrides[get_db] = get_session_override

        client = TestClient(app)

        response = client.post(
            "/expenses/", json={"name": "Food", "amount": 100, "due_date": 1}
        )
        app.dependency_overrides.clear()
        data = response.json()

        assert response.status_code == 200
        assert data["name"] == "Food"
        assert data["amount"] == 100
        assert data["due_date"] == 1
        assert data["id"] is not None
