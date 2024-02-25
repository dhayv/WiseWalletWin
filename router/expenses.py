from fastapi import APIRouter, Depends
from models import Expense
from sqlmodel import Session
from database import get_db

router = APIRouter()

@router.post("/expenses")
def get_expenses(expense: Expense, db: Session = Depends(get_db)):
    dummy_expense = Expense(name="Water", amount=1000, due_date=1)
    db.add(dummy_expense)
    db.commit()
    db.refresh(dummy_expense)
    return {"Message": "Expenses added Successfully" }

@router.get("/expenses")
def read_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    return expenses
