from fastapi import FastAPI
from sqlmodel import SQLModel
from main import engine
from routes.expenses import Expense
from routes.income import Income


app = FastAPI()


def create_db_and_tables(): 
    SQLModel.metadata.create_all(engine)









