from sqlmodel import Field, SqlModel, create_engine


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:////{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


