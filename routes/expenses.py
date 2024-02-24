from fastapi import APIRouter
from models import Expense
from main import app





@app.post("/expenses")
def get_expenses(expense: Expense):
    return {"Message": "Expenses added Successfully" }