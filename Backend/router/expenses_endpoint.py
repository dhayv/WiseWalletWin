from fastapi import APIRouter, Depends, HTTPException, Response, status
from models import Expense, ExpenseUpdate, ExpenseBase, Income, Users
from sqlmodel import Session, select
from database.database import get_db, engine
from Services.auth import get_current_active_user

router = APIRouter()

def create_expenses():
    with Session(engine) as session:
        # Create some dummy expenses
        expense1 = Expense(name="Water Bill", amount=50, due_date=15)
        expense2 = Expense(name="Electricity Bill", amount=75, due_date=18)

        #check if data already in database
        statement1 = select(Expense).where(Expense.name== expense1.name, Expense.amount==expense1.amount, Expense.due_date==expense1.due_date)
        statement2 = select(Expense).where(Expense.name== expense2.name, Expense.amount==expense2.amount, Expense.due_date==expense2.due_date)
        result1 = session.exec(statement1).first()
        result2 = session.exec(statement2).first()


        if not result1:
            session.add(expense1)

        if not result2:
            session.add(expense2)

        if not result1 or not result2:
            session.commit()

@router.post("/expenses/{income_id}", response_model=Expense, status_code=status.HTTP_201_CREATED)
def add_expense(expense_data: ExpenseBase, income_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    user_id = current_user.id
    income = db.exec(select(Income).filter(Income.id == income_id, Income.id == user_id)).first()

    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    expense = Expense(**expense_data.model_dump(),  income_id=income_id, user_id=user_id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense    

@router.get("/expenses/{income_id}", response_model=list[Expense])
def read_expenses(income_id: int, db: Session = Depends(get_db), current_user: Users = Depends(get_current_active_user)):
    statement = select(Expense).where(Expense.income_id == income_id, Expense.user_id == current_user.id)
    results = db.exec(statement)
    expenses = results.all() 

    return expenses




@router.put("/expenses/{expense_id}")
def update_expense(expense_id: int ,expense_data: ExpenseUpdate, db: Session = Depends(get_db)):
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

