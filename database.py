from sqlmodel import create_engine, SQLModel


#sqlite_file_name = "database.db"
sqlite_url = "sqlite:///./db.sqlite3"

engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables(): 
    SQLModel.metadata.create_all(engine)



#if __name__ == "__main__":
    #create_db_and_tables() 