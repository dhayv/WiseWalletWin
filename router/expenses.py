from fastapi import APIRouter, Depends, HTTPException, Response, status
from models import Expense, ExpenseUpdate
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

@router.post("/expenses")
def add_expense(expense: Expense, db: Session = Depends(get_db)):
    db.add(expense)
    db.commit()
    return {"message": "Expense added successfully"}        

@router.get("/expenses", response_model=list[Expense])
def read_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    return expenses


@router.put("/expenses/{expense_id}")
def update_expense(expense_id: int ,expense_data: ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.get(Expense, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense_data_dict = expense_data.dict(exclude_unset=True)
    for key, value in expense_data_dict.items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.get(Expense, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(db_expense)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

