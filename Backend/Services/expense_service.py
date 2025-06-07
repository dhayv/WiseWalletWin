from typing import Optional

from fastapi import HTTPException

from models import Category, Expense, ExpenseBase, ExpenseUpdate, Income
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

        category_doc = None

        if expense_data.category_name:
            category_doc = await Category.find_one({"name": expense_data.category_name})
            if not category_doc:
                raise HTTPException(status_code=404, detail="Category not found")

        expense = Expense(
            **expense_data.model_dump(),
            income_id=income.id,
            user_id=valid_user_id,
            category=category_doc,
        )
        await expense.insert()
        return expense

    async def read_expense(
        self, income_id: str, user_id: str, category_name: Optional[str] = None
    ):
        valid_user_id = validate_object_id(user_id)
        valid_income_id = validate_object_id(income_id)

        query = {
            "income_id.$id": valid_income_id,
            "user_id.$id": valid_user_id,
        }

        if category_name:
            cat = await Category.find_one(Category.name == category_name)
            if not cat:
                raise HTTPException(status_code=404, detail="Category not found")
            query["category.$id"] = cat.id

        expenses = await Expense.find(query).to_list()

        for exp in expenses:
            await exp.fetch_link(Expense.category)

        return expenses

    async def update_expense(
        self, expense_id: str, expense_data: ExpenseUpdate
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
