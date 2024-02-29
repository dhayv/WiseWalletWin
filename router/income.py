from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import Income
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

