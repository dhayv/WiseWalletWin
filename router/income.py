from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Income, IncomeUpdate
from database import get_db


router = APIRouter()

@router.post("/income")
def create_income(income: Income, db: Session = Depends(get_db)):
    db.add(income)
    db.commit()
    return {"Message": "Income added Successfully" }

@router.get("/income{income_id}")
def read_income(income: Income, db: Session = Depends(get_db)):
    db.add(income)
    db.commit()
    return {"Message": "Income added Successfully" }

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

@router.delete("income/{income_id}", status_code=204)
def delete_income(income_id: int, db: Session = Depends(get_db)):
    db_income = db.get(Income, income_id)
    if not db_income:
        raise HTTPException(status_code=404, detail="income not found")
    db.delete(db_income)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)