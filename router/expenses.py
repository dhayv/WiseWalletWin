from fastapi import APIRouter
from models import Expense


router = APIRouter()

@router.post("/expenses")
def get_expenses(expense: Expense):
    return {"Message": "Expenses added Successfully" }