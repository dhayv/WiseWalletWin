from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from models import Income, IncomeBase, IncomeUpdate
from utils.helpers import update_document_or_404, validate_object_id

router = APIRouter()


class IncomeService:

    async def add_income(self, income_data: IncomeBase, user_id: str) -> Income:
        valid_user_id = validate_object_id(user_id)

        existing_income = await Income.find_one(
            {"user_id.$id": PydanticObjectId(valid_user_id)}
        )
        if income_data.amount is None:
            income_data.amount = 0.0

        if existing_income:

            # Update the existing income entry
            return await update_document_or_404(existing_income, income_data)
        else:
            # Create a new income entry defalut amount value is 0
            default_amount = income_data.amount if income_data.amount is not None else 0

            new_income = Income(
                amount=default_amount,
                recent_pay=income_data.recent_pay,
                last_pay=income_data.last_pay,
                user_id=user_id,
            )

            await new_income.insert()
            return new_income

    async def read_all_incomes(self, user_id: str) -> list[Income]:
        valid_user_id = validate_object_id(user_id)

        return await Income.find(
            {"user_id.$id": PydanticObjectId(valid_user_id)}
        ).to_list()

    async def update_income(
        self,
        income_id: str,
        income_data: IncomeUpdate,
    ) -> Income:

        valid_income_id = validate_object_id(income_id)

        if income_data is None:
            raise HTTPException(status_code=400, detail="Null not allowed")

        db_income = await Income.get(valid_income_id)

        if db_income is None:
            raise HTTPException(status_code=400, detail="Null not allowed")

        return await update_document_or_404(db_income, income_data)
