from beanie import PydanticObjectId
from fastapi import HTTPException

from models import Expense, Income


def validate_object_id(object_id: str):
    if not object_id or object_id == "null":
        raise HTTPException(status_code=400, detail="Invalid or missing income ID")
    try:
        return PydanticObjectId(object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed ID")


async def sum_of_all_expenses(user_id: str):

    valid_user_id = validate_object_id(user_id)

    user_id_obj = valid_user_id
    expenses = Expense.find({"user_id.$id": user_id_obj})
    total = 0

    async for expense in expenses:
        total += expense.amount

    return total


async def calc_income_minus_expenses(user_id: str):

    valid_user_id = validate_object_id(user_id)
    # Expenses sum together
    total_expense = sum_of_all_expenses(valid_user_id)
    # Income information from user
    incomes = Income.find({"_id": valid_user_id})

    total_income = 0

    async for income in incomes:
        total_income += income.amount

    return total_income - total_expense
