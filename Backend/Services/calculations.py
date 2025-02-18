from beanie import PydanticObjectId

from models import Expense, Income


async def sum_of_all_expenses(user_id: str):
    user_id_obj = PydanticObjectId(user_id)
    expenses = Expense.find({"user_id.$id": user_id_obj})
    total = 0

    async for expense in expenses:
        total += expense.amount

    return total


async def calc_income_minus_expenses(user_id: str):
    # Expenses sum together
    total_expense = sum_of_all_expenses(user_id)
    # Income information from user
    incomes = Income.find(Income.user_id == user_id)

    total_income = 0

    async for income in incomes:
        total_income += income.amount

    return total_income - total_expense
