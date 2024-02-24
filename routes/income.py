from fastapi import APIRouter
from models import Income
from main import app


router = APIRouter()

@router.post("/income")
def get_income(income: Income):
    return {"Message": "Income added Successfully" }