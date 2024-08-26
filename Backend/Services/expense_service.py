import logging
from typing import Optional

from beanie import PydanticObjectId
from bson import ObjectId
from bson.dbref import DBRef
from fastapi import HTTPException
from models import Expense, ExpenseBase, ExpenseUpdate, Income


class ExpenseService:

    async def add_expense(
        self, expense_data: ExpenseBase, income_id: str, user_id: str
    ) -> Expense:
        income = await Income.find_one(
            {
                "_id": PydanticObjectId(income_id),
                "user_id.$id": PydanticObjectId(user_id),
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
        income_id_obj = PydanticObjectId(income_id)
        user_id_obj = PydanticObjectId(user_id)

        income_ref = DBRef(collection="Income", id=income_id_obj)
        user_ref = DBRef(collection="Users", id=user_id_obj)

        expenses = await Expense.find(
            {"income_id": income_ref, "user_id": user_ref}
        ).to_list()
        logging.info(f"Income_id found: {income_id}")
        logging.info(f"user_id found: {user_id}")
        logging.info(f"Expenses found: {expenses}")

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
        db_expense = await Expense.get(expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        await db_expense.update({"$set": expense_data.model_dump(exclude_unset=True)})

        return db_expense

    async def delete_expense(self, expense_id: str) -> None:
        if not expense_id or not ObjectId.is_valid(expense_id):
            raise HTTPException(status_code=400, detail="Invalid expense ID")

        expense_id_obj = PydanticObjectId(expense_id)

        db_expense = await Expense.get(expense_id_obj)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        await db_expense.delete()
