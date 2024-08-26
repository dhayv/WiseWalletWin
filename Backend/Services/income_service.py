import logging

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from models import Income, IncomeBase, IncomeUpdate

router = APIRouter()


class IncomeService:

    async def add_income(self, income_data: IncomeBase, user_id: str) -> Income:
        db_income = Income(**income_data.model_dump(), user_id=user_id)

        await db_income.insert()
        return db_income

    async def read_all_incomes(self, user_id: str) -> list[Income]:
        try:
            incomes = await Income.find(
                {"user_id.$id": PydanticObjectId(user_id)}
            ).to_list()
            logging.info(f"Query successful. Incomes found: {incomes}")
        except Exception as e:
            logging.error(f"Error querying incomes: {str(e)}")
            incomes = []

        return incomes

    async def update_income(
        self,
        income_id: str,
        income_data: IncomeUpdate,
    ) -> Income:
        db_income = await Income.get(income_id)
        if not db_income:
            raise HTTPException(status_code=404, detail="income not found")
        await db_income.update({"$set": income_data.model_dump(exclude_unset=True)})

        return db_income
