from sqlmodel import Session, select
from models import Expense, Income



def sum_of_all_expenses(user_id: int, db: Session):
    statement = select(Expense).where(Expense.user_id == user_id)
    result = db.exec(statement)
    expenses = result.all()
    total = sum(expense.amount for expense in expenses)
    return total


def calc_income_minus_expenses(user_id: int, db: Session):
    #Expenses sum together
    total_expense = sum_of_all_expenses(user_id, db)
    # Income information from user
    income_statement = select(Income).where(Income.user_id == user_id)
    result = db.exec(income_statement)
    income_info = result.all()

    total_income = sum(income.amount for income in income_info)
    return total_income - total_expense
