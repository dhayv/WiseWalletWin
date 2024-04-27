from data_base.database import get_db
from fastapi import APIRouter, Depends, HTTPException, Response, status
from models import Expense, ExpenseBase, ExpenseUpdate, Users
from Services.auth import get_current_active_user
from Services.expense_service import ExpenseService
from sqlmodel import Session

router = APIRouter()


def get_expense_service(db: Session = Depends(get_db)):
    return ExpenseService(db)


@router.post(
    "/expenses/{income_id}", response_model=Expense, status_code=status.HTTP_201_CREATED
)
def add_expense(
    expense_data: ExpenseBase,
    income_id: int,
    service: ExpenseService = Depends(get_expense_service),
    current_user: Users = Depends(get_current_active_user),
):
    return service.add_expense(expense_data, income_id, current_user.id)


@router.get("/expenses/{income_id}", response_model=list[Expense])
def read_expenses(
    income_id: int,
    service: ExpenseService = Depends(get_expense_service),
    current_user: Users = Depends(get_current_active_user),
):
    return service.read_expense(income_id, current_user.id)


@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    service: ExpenseService = Depends(get_expense_service),
):
    updated_expense = service.update_expense(expense_id, expense_data)
    if not updated_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated_expense


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(
    expense_id: int, 
    service: ExpenseService = Depends(get_expense_service),
):
    service.delete_expense(expense_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
