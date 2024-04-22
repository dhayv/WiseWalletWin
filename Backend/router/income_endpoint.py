from datetime import datetime

from data_base.database import engine, get_db
from fastapi import APIRouter, Depends, HTTPException, status
from models import Income, IncomeBase, IncomeUpdate
from sqlmodel import Session, select

router = APIRouter()


def create_income():
    with Session(engine) as session:
        # Convert string dates to datetime.date objects
        recent_pay_date = datetime.strptime("03-01-2024", "%m-%d-%Y").date()
        last_pay_date = datetime.strptime("02-16-2024", "%m-%d-%Y").date()

        # check if data already in database
        statement = select(Income).where(
            Income.recent_pay == recent_pay_date, Income.last_pay == last_pay_date
        )
        result = session.exec(statement).first()
        if not result:
            income1 = Income(
                amount=6000, recent_pay=recent_pay_date, last_pay=last_pay_date
            )
            session.add(income1)
            session.commit()
            session.refresh(income1)
            return income1


@router.post(
    "/income/{user_id}", response_model=Income, status_code=status.HTTP_201_CREATED
)
def add_income(income_data: IncomeBase, user_id: int, db: Session = Depends(get_db)):
    db_income = Income(**income_data.model_dump(), user_id=user_id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income


# @router.get("/income/{income_id}")
# def read_income(income_id: int, db: Session = Depends(get_db)):
#   income = db.get(Income, income_id)
#  if not income:
#     raise HTTPException(status_code=404, detail="Income not found")
# return income#


@router.get("/income/{user_id}", response_model=list[Income])
def read_all_incomes(user_id: int, db: Session = Depends(get_db)):
    statement = select(Income).where(Income.user_id == user_id)
    results = db.exec(statement)
    incomes = results.all()

    return incomes


@router.get("/test_income", response_model=Income)
def test_read_all_incomes():
    with Session(engine) as session:
        statement = select(Income)
        results = session.exec(statement)
        incomes = results.all()
        return incomes


@router.put("/income/{income_id}", response_model=Income)
def update_income(
    income_id: int, income_data: IncomeUpdate, db: Session = Depends(get_db)
):
    db_income = db.get(Income, income_id)
    if not db_income:
        raise HTTPException(status_code=404, detail="income not found")
    income_data_dict = income_data.model_dump(exclude_unset=True)
    for key, value in income_data_dict.items():
        setattr(db_income, key, value)
    db.commit()
    db.refresh(db_income)
    return db_income
