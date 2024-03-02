from sqlmodel import Session, create_engine, SQLModel
from contextlib import contextmanager
import logging


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')



# database URL
sqlite_url = "sqlite:///./db.sqlite3"

# Creates database engine
engine = create_engine(sqlite_url, echo=True)

# Session conveyor belt


def get_db():
    with Session(engine) as db:
        yield db


#Create database and tables
def create_db_and_tables(): 
    SQLModel.metadata.create_all(engine)



#if __name__ == "__main__":
    #create_db_and_tables() 