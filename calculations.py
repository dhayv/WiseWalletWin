from sqlmodel import Session, select
from models import Expense, Income



def sum_of_all_expenses(user_id: int, db: Session):
    statement = select(Expense).where(Expense.user_id)
    result = db.exec(statement)
    expenses = result.all()
    for expense in expenses:
        return sum(expense.amount)


def income_minus_expenses(user_id: int, income_id: int, db: Session):
    total_expense = sum_of_all_expenses(user_id, db)

    income_statement = select(Income).where(Income.user_id)
    income_info = income_statement.all()
    for income in income_info:
        total_income = sum(income.amount)
    return total_income - total_expense
