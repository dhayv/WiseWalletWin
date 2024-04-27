from fastapi import APIRouter, HTTPException
from models import Income, IncomeBase, IncomeUpdate
from sqlmodel import Session, select

router = APIRouter()


class IncomeService:
    def __init__(self, db_session: Session) -> None:
        self.db = db_session

    def add_income(
            self,
            income_data: IncomeBase,
            user_id: int
    ):
        db_income = Income(**income_data.model_dump(), user_id=user_id)
        self.db.add(db_income)
        self.db.commit()
        self.db.refresh(db_income)
        return db_income

    def read_all_incomes(
            self,
            user_id: int,
    ):
        statement = select(Income).where(Income.user_id == user_id)
        results = self.db.exec(statement)
        incomes = results.all()
        return incomes

    def update_income(
        self,
        income_id: int,
        income_data: IncomeUpdate,
    ):
        db_income = self.db.get(Income, income_id)
        if not db_income:
            raise HTTPException(status_code=404, detail="income not found")
        income_data_dict = income_data.model_dump(exclude_unset=True)
        for key, value in income_data_dict.items():
            setattr(db_income, key, value)
        self.db.commit()
        self.db.refresh(db_income)
        return db_income
