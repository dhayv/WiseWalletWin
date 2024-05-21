import logging
import os

from sqlmodel import Session, SQLModel, create_engine

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


# database URL
sqlite_url = os.getenv("DATABASE_URL", "sqlite:///./db.sqlite3")

# Creates database engine
engine = create_engine(sqlite_url, echo=True)

# Session conveyor belt


def get_db():
    with Session(engine) as db:
        yield db


# Create database and tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
