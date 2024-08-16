from fastapi import APIRouter, Depends, HTTPException, Response, status
from models import Expense, ExpenseBase, ExpenseUpdate, Users
from Services.auth import get_current_active_user
from Services.expense_service import ExpenseService

router = APIRouter()


def get_expense_service() -> ExpenseService:
    return ExpenseService()


@router.post(
    "/expenses/{income_id}", response_model=Expense, status_code=status.HTTP_201_CREATED
)
async def add_expense(
    expense_data: ExpenseBase,
    income_id: int,
    service: ExpenseService = Depends(get_expense_service),
    current_user: Users = Depends(get_current_active_user),
):
    return await service.add_expense(expense_data, income_id, current_user.id)


@router.get("/expenses/{income_id}", response_model=list[Expense])
async def read_expenses(
    income_id: int,
    service: ExpenseService = Depends(get_expense_service),
    current_user: Users = Depends(get_current_active_user),
):
    return await service.read_expense(income_id, current_user.id)


@router.put("/expenses/{expense_id}")
async def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    service: ExpenseService = Depends(get_expense_service),
):
    updated_expense = await service.update_expense(expense_id, expense_data)
    if not updated_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated_expense


@router.delete("/expenses/{expense_id}", status_code=204)
async def delete_expense(
    expense_id: int,
    service: ExpenseService = Depends(get_expense_service),
):
    await service.delete_expense(expense_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
