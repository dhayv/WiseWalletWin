from sqlmodel import Session, create_engine, SQLModel
from contextlib import contextmanager


# database URL
sqlite_url = "sqlite:///./db.sqlite3"

# Creates database engine
engine = create_engine(sqlite_url, echo=True)

# Session conveyor belt
@contextmanager
def get_db():
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()



#Create database and tables
def create_db_and_tables(): 
    SQLModel.metadata.create_all(engine)



#if __name__ == "__main__":
    #create_db_and_tables() 