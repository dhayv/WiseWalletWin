from fastapi import APIRouter, HTTPException

from models import Income, IncomeBase, IncomeUpdate

router = APIRouter()


class IncomeService:

    async def add_income(self, income_data: IncomeBase, user_id: int) -> Income:
        db_income = await Income(**income_data.model_dump(), user_id=user_id)

        await db_income.insert()
        return db_income

    async def read_all_incomes(self, user_id: int) -> list[Income]:
        incomes = await Income.find(Income.user_id == user_id).to_list()
        return incomes

    async def update_income(
        self,
        income_id: int,
        income_data: IncomeUpdate,
    ) -> Income:
        db_income = await Income.get(income_id)
        if not db_income:
            raise HTTPException(status_code=404, detail="income not found")
        await db_income.update({"$set": income_data.model_dump(exclude_unset=True)})

        return db_income
