from fastapi import APIRouter, Depends
from models import Expense
from sqlmodel import Session
from database import get_db, engine

router = APIRouter()

def create_expenses():
    with Session(engine) as session:
        # Create some dummy expenses
        expense1 = Expense(name="Water Bill", amount=50, due_date=15)
        expense2 = Expense(name="Electricity Bill", amount=75, due_date=18)
        
        # Add them to the session
        session.add(expense1)
        session.add(expense2)
        
        # Commit the transaction
        session.commit()

@router.get("/expenses")
def read_expenses():
    return [{"name": "Test Expense", "amount": 100, "due_date": 15}]

