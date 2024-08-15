from fastapi import HTTPException, Response, status
from models import Expense, ExpenseBase, ExpenseUpdate, Income
from beanie import PydanticObjectId
from typing import Optional

class ExpenseService:


    async def add_expense(self, expense_data: ExpenseBase, income_id: int, user_id: int) -> Expense:

        income = await Income.find_one(Income.id == income_id, Income.user_id == user_id)
        if not income:
            raise HTTPException(status_code=404, detail="Income not found")

        expense = Expense(**expense_data.model_dump(), income_id=income_id, user_id=user_id)
        await expense.insert()
        return expense

    async def read_expense(self, income_id: int, user_id: int):
        statement = select(Expense).where(
            Expense.income_id == income_id, Expense.user_id == user_id
        )
        results = self.db.exec(statement)
        expenses = results.all()

        return expenses

    async def update_expense(
        self,
        expense_id: int,
        expense_data: ExpenseUpdate,
    ):
        db_expense = self.db.get(Expense, expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        expense_data_dict = expense_data.model_dump(exclude_unset=True)
        for key, value in expense_data_dict.items():
            setattr(db_expense, key, value)
        self.db.commit()
        self.db.refresh(db_expense)
        return db_expense

    async def delete_expense(self, expense_id: int):
        db_expense = self.db.get(Expense, expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Not found")
        self.db.delete(db_expense)
        self.db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
