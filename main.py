from fastapi import FastAPI
from pydantic import BaseModel, validator, ValidationError
from datetime import date, datetime 
import datetime

app = FastAPI()

from pydantic import BaseModel, validator, ValidationError
from datetime import datetime

class Income(BaseModel):
    amount: float
    recent_pay: date  # most recent pay day in format MM-DD-YYYY
    last_pay: date | None = None  # Last pay date two weeks prior to recent_pay MM-DD-YYYY

    @validator('recent_pay', 'last_pay', pre=True, allow_reuse=True)
    def check_date_format(cls, value): #the "value" is the recent_pay and last_pay
        if value is None:
            return value
        try:
            # Attempt to parse the date string to ensure it matches the desired format
            return datetime.strptime(value, "%m-%d-%Y").date()
        except ValueError:
            # Raise an error if the date does not match the format
            raise ValueError("Date must be in MM-DD-YYYY format")




@app.post("/income")
def get_income(income: Income):
    return {"Message": "Income added Successfully" }



