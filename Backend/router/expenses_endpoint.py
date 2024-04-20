from fastapi import APIRouter, Depends, HTTPException, Response, status
from models import Expense, ExpenseUpdate, ExpenseBase, Income, Users
from sqlmodel import Session, select
from database.database import get_db
from Services.auth import get_current_active_user

router = APIRouter()


class ExpenseService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def add_expense(self):
        pass

    def get_expense(self):
        pass

    def update_expense(self):
        pass

    def delete_expense(self):
        pass


@router.post(
    "/expenses/{income_id}", response_model=Expense, status_code=status.HTTP_201_CREATED
)
def add_expense(
    expense_data: ExpenseBase,
    income_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_active_user),
):
    user_id = current_user.id
    income = db.exec(
        select(Income).filter(Income.id == income_id, Income.id == user_id)
    ).first()

    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    expense = Expense(**expense_data.model_dump(), income_id=income_id, user_id=user_id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.get("/expenses/{income_id}", response_model=list[Expense])
def read_expenses(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_active_user),
):
    statement = select(Expense).where(
        Expense.income_id == income_id, Expense.user_id == current_user.id
    )
    results = db.exec(statement)
    expenses = results.all()

    return expenses


@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int, expense_data: ExpenseUpdate, db: Session = Depends(get_db)
):
    db_expense = db.get(Expense, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense_data_dict = expense_data.model_dump(exclude_unset=True)
    for key, value in expense_data_dict.items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.get(Expense, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_expense)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
