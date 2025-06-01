from typing import Optional

from fastapi import HTTPException

from models import Expense, ExpenseBase, ExpenseUpdate, Income
from utils.helpers import update_document_or_404, validate_object_id


class ExpenseService:

    async def add_expense(
        self, expense_data: ExpenseBase, income_id: str, user_id: str
    ) -> Expense:

        valid_user_id = validate_object_id(user_id)

        valid_income_id = validate_object_id(income_id)

        income = await Income.find_one(
            {
                "_id": valid_income_id,
                "user_id.$id": valid_user_id,
            }
        )
        if not income:
            raise HTTPException(status_code=404, detail="Income not found")

        expense = Expense(
            **expense_data.model_dump(), income_id=income.id, user_id=user_id
        )
        await expense.insert()
        return expense

    async def read_expense(self, income_id: str, user_id: str) -> list[Expense]:

        valid_user_id = validate_object_id(user_id)

        valid_income_id = validate_object_id(income_id)

        expenses = await Expense.find(
            {
                "income_id.$id": valid_income_id,
                "user_id.$id": valid_user_id,
            }
        ).to_list()

        return expenses

        # {"_id":{"$oid":"66ccb0c8f53d14be21c53ce8"},
        # "name":"Rent",
        # "amount":{"$numberDouble":"1.0"},
        # "due_date":{"$numberInt":"5"},
        # "user_id":{"$ref":"Users","$id":{"$oid":"66cb717d0911daf5a7756434"}},
        # "income_id":{"$ref":"Income","$id":{"$oid":"66cb737780d784482c2dbdf5"}}}

    async def update_expense(
        self,
        expense_id: str,
        expense_data: ExpenseUpdate,
    ) -> Optional[Expense]:
        valid_expense_id = validate_object_id(expense_id)

        db_expense = await Expense.get(valid_expense_id)

        return await update_document_or_404(db_expense, expense_data)

    async def delete_expense(self, expense_id: str) -> None:
        valid_expense_id = validate_object_id(expense_id)

        db_expense = await Expense.get(valid_expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        await db_expense.delete()
