from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from models import Income, IncomeBase, IncomeUpdate

router = APIRouter()


class IncomeService:

    async def add_income(self, income_data: IncomeBase, user_id: str) -> Income:
        existing_income = await Income.find_one(
            {"user_id.$id": PydanticObjectId(user_id)}
        )
        if income_data.amount is None:
            income_data.amount = 0.0

        if existing_income:

            # Update the existing income entry
            update_data = income_data.model_dump(exclude_unset=True)
            await existing_income.update({"$set": update_data})
            return existing_income
        else:
            # Create a new income entry defalut amount value is 0
            default_amount = income_data.amount if income_data.amount is not None else 0

            new_income = Income(
                amount=default_amount,
                recent_pay=income_data.recent_pay,
                last_pay=income_data.last_pay,
                user_id=user_id
            )

            await new_income.insert()
            return new_income

    async def read_all_incomes(self, user_id: str) -> list[Income]:
        incomes = await Income.find(
            {"user_id.$id": PydanticObjectId(user_id)}
        ).to_list()
        return incomes

    async def update_income(
        self,
        income_id: str,
        income_data: IncomeUpdate,
    ) -> Income:

        if income_data is None:
            raise HTTPException(status_code=400, detail="Null not allowed")

        db_income = await Income.get(income_id)

        if db_income is None:
            raise HTTPException(status_code=400, detail="Null not allowed")

        if not db_income:
            raise HTTPException(status_code=404, detail="income not found")
        await db_income.update({"$set": income_data.model_dump(exclude_unset=True)})

        return db_income
