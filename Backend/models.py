import logging
import re
from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, StringConstraints, field_validator
from sqlmodel import AutoString, Field, SQLModel
from typing_extensions import Annotated

# Regex for phone number validation
phone_number_regex = r"^(?:\(\d{3}\)|\d{3}-?)\d{3}-?\d{4}$"


# Base user model for common user fields
class BaseUser(SQLModel):
    username: str = Field(index=True)
    email: EmailStr = Field(unique=True, index=True, sa_type=AutoString)
    first_name: Optional[str] = None
    phone_number: Optional[str]


# Input model including password validation
class UserIn(BaseModel):
    username: str
    first_name: Optional[str] = None
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone_number: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            pattern=r"^(?:\(\d{3}\)|\d{3})[-\s]?\d{3}[-\s]?\d{4}$",
        ),
    ]

    @field_validator("password")
    @classmethod
    def password_complexity(cls, value):
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character")
        return value


# Output model to send user data back to the client
class UserOut(BaseUser):
    id: int


# SQLModel for ORM mapping, including hashed_password and disabled fields
class Users(BaseUser, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    disabled: Optional[bool] = False


# Model for updating user information
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    password: Optional[str] = None


class EmailSchema(BaseModel):
    email: List[EmailStr]


class IncomeBase(BaseModel):
    amount: float
    recent_pay: date
    last_pay: Optional[date] = None

    # Validator for recent_pay
    @field_validator("recent_pay", mode="before")
    @classmethod
    def parse_recent_pay(cls, value):

        # debugging
        logging.info(f"Validating recent_pay: {value}")
        if isinstance(value, str):
            try:
                return datetime.strptime(value, "%m-%d-%Y").date()
            except ValueError as e:
                logging.error(f"Error parsing recent_pay: {e}")
                raise e
        return value

    # Validator for last_pay
    @field_validator("last_pay", mode="before")
    @classmethod
    def parse_last_pay(cls, value):

        # debugging
        logging.info(f"Validating last_pay: {value}")
        if value is not None and isinstance(value, str):
            try:
                return datetime.strptime(value, "%m-%d-%Y").date()
            except ValueError as e:
                logging.error(f"Error parsing last_pay: {e}")
                raise e
        return value


class Income(IncomeBase, SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float = Field(index=True)
    recent_pay: date = Field(index=True)  # Ensuring this is a date object
    last_pay: Optional[date] = None  # This can be None or a date object

    user_id: Optional[int] = Field(
        default=None, foreign_key="users.id", unique=True, index=True
    )


# passed incomebase to reduce extra validation
class IncomeUpdate(IncomeBase):
    amount: Optional[float] = None
    recent_pay: Optional[date] = None
    last_pay: Optional[date] = None


class ExpenseBase(BaseModel):
    name: str
    amount: float
    due_date: Optional[int]

    @field_validator("due_date", mode="before")
    @classmethod
    def check_due_date(cls, v):
        if v is None:
            return v
        try:
            v_int = int(v)
            if not 1 <= v_int <= 31:
                raise ValueError("Due date must be between 1 and 31")
            return v_int
        except ValueError:
            raise ValueError("Due date must be an integer and between 1 and 31")


class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    amount: float = Field(index=True)
    due_date: Optional[int] = Field(
        default=None, index=True
    )  # Due date of the expense (days of the month(1-30 or 31))

    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    income_id: Optional[int] = Field(default=None, foreign_key="income.id", index=True)


# Pydantic Models for Request Validation and Serialization
class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[int] = None
