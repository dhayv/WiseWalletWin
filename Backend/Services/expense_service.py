from fastapi import HTTPException
from models import Expense, ExpenseBase, ExpenseUpdate, Income
from typing import Optional


class ExpenseService:

    async def add_expense(self, expense_data: ExpenseBase, income_id: int, user_id: int) -> Expense:

        income = await Income.find_one(Income.id == income_id, Income.user_id == user_id)
        if not income:
            raise HTTPException(status_code=404, detail="Income not found")

        expense = Expense(**expense_data.model_dump(), income_id=income_id, user_id=user_id)
        await expense.insert()
        return expense

    async def read_expense(self, income_id: int, user_id: int) -> list[Expense]:
        expenses = await Expense.find(
            Expense.income_id == income_id, Expense.user_id == user_id
        )

        return expenses

    async def update_expense(
        self,
        expense_id: int,
        expense_data: ExpenseUpdate,
    ) -> Optional[Expense]:
        db_expense = await Expense.get(expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        await db_expense.update({"$set": expense_data.model_dump(exclude_unset=True)})

        return db_expense

    async def delete_expense(self, expense_id: int) -> None:
        db_expense = await Expense.get(expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Not found")

        await db_expense.delete()
