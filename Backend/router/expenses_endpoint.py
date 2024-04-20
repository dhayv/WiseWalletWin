from fastapi import APIRouter, Depends, Response, status
from models import Expense, ExpenseUpdate, ExpenseBase, Users
from sqlmodel import Session
from database.database import get_db
from Services.auth import get_current_active_user
from Services.

router = APIRouter()


@router.post(
    "/expenses/{income_id}", response_model=Expense, status_code=status.HTTP_201_CREATED
)
def add_expense(
    expense_data: ExpenseBase,
    income_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_active_user),
):
    service = ExpenseService(db)
    return service.add_expense(expense_data, income_id, current_user.id)


@router.get("/expenses/{income_id}", response_model=list[Expense])
def read_expenses(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_active_user),
):
    service = ExpenseService(db)
    return service.read_expense(income_id, current_user)


@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db)
):
    service = ExpenseService(db)
    return service.update_expense(expense_id, expense_data)


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    service = ExpenseService(db)
    service.delete_expense(expense_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
