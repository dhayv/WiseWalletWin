from fastapi import FastAPI
from sqlmodel import SQLModel
from main import engine


app = FastAPI()


def create_db_and_tables(): 
    SQLModel.metadata.create_all(engine)









