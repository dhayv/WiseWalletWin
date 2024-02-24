from fastapi import FastAPI
from sqlmodel import SQLModel
from . import models, database
from routes.expenses import Expense
from routes.income import Income



app = FastAPI()


def on_startup():
    database.create_db_and_tables









