from fastapi import APIRouter
from models import Income



router = APIRouter()

@router.post("/income")
def get_income(income: Income):
    return {"Message": "Income added Successfully" }


