@app.post("/income")
def get_income(income: Income):
    return {"Message": "Income added Successfully" }

@app.post("/expenses")
def get_expenses(expense: Expense):
    return {"Message": "Expenses added Successfully" }