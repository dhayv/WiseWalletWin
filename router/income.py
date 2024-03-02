from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Income, IncomeUpdate
from database import get_db, engine
from datetime import  datetime




router = APIRouter()

def create_income():
    with Session(engine) as session:
        # Convert string dates to datetime.date objects
        recent_pay_date = datetime.strptime("03-01-2024", "%m-%d-%Y").date()
        last_pay_date = datetime.strptime("02-16-2024", "%m-%d-%Y").date()

        income1 = Income(amount=6000, recent_pay=recent_pay_date, last_pay=last_pay_date)
        
        session.add(income1)
        session.commit()



@router.post("/income")
def add_income(income: Income, db: Session = Depends(get_db)):
    db.add(income)
    db.commit()
    return {"Message": "Income added Successfully" }

#@router.get("/income/{income_id}")
#def read_income(income_id: int, db: Session = Depends(get_db)):
 #   income = db.get(Income, income_id)
  #  if not income:
   #     raise HTTPException(status_code=404, detail="Income not found")
    #return income#

@router.get("/income")
def read_all_incomes(db: Session = Depends(get_db)):
    statement = select(Income)
    results = db.exec(statement)  
    incomes = results.all()  
    return incomes

@router.get("/test_income")
def test_read_all_incomes():
    with Session(engine) as session:
        statement = select(Income)
        results = session.exec(statement)
        incomes = results.all()
        return incomes
    
@router.put("/income/{income_id}")
def update_income(income_id: int ,income_data: IncomeUpdate, db: Session = Depends(get_db)):
    db_income = db.get(Income, income_id)
    if not db_income:
        raise HTTPException(status_code=404, detail="income not found")
    income_data_dict = income_data.dict(exclude_unset=True)
    for key, value in income_data_dict.items():
        setattr(db_income, key, value)
    db.commit()
    db.refresh(db_income)
    return db_income

@router.delete("/income/{income_id}", status_code=204)
def delete_income(income_id: int, db: Session = Depends(get_db)):
    db_income = db.get(Income, income_id)
    if not db_income:
        raise HTTPException(status_code=404, detail="income not found")
    db.delete(db_income)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)