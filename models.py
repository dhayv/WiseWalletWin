from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import validator, BaseModel
from datetime import date, datetime


class Income(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    recent_pay: date  # most recent pay day in format MM-DD-YYYY
    last_pay: date | None  # Last pay date two weeks prior to recent_pay MM-DD-YYYY

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
        
class Income(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source: str
    amount: float
    date_received: Optional[str] = None

class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    amount: float
    due_date: Optional[int] = None # Due date of the expense (days of the month(1-30 or 31))
    @validator('due_date')
    def check_due_date(cls, v):
        if v is None:
            return v
        if v < 1 or v >= 31:
            raise ValueError("Due date must be between 1 and 31")
        return v

# Pydantic Models for Request Validation and Serialization
class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[int] = None    