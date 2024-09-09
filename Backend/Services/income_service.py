from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from models import Income, IncomeBase, IncomeUpdate

router = APIRouter()


class IncomeService:

    async def add_income(self, income_data: IncomeBase, user_id: str) -> Income:
        existing_income = await Income.find_one(
            {"user_id.$id": PydanticObjectId(user_id)}
        )

        if existing_income:
            # Update the existing income entry
            update_data = income_data.model_dump(exclude_unset=True)
            await existing_income.update({"$set": update_data})
            return existing_income
        else:
            # Create a new income entry
            new_income = Income(**income_data.model_dump(), user_id=user_id)
            await new_income.insert()
            return new_income

    async def read_all_incomes(self, user_id: str) -> list[Income]:
        incomes = await Income.find({"user_id.$id": PydanticObjectId(user_id)}).to_list()

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
