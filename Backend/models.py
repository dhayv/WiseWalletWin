import logging
import re
from datetime import date, datetime, timezone
from typing import Optional

from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field, field_validator

logging.basicConfig(level=logging.INFO)


class Category(Document):
    name: Optional[str] = None
    description: str = Field(..., unique=True, description="Category Description")

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True


# Base user model for common user fields
class BaseUser(Document):
    username: str = Field(..., index=True)
    email: EmailStr = Field(
        ...,
        unique=True,
        index=True,
    )
    first_name: Optional[str] = None
    is_email_verified: bool = Field(default=True, index=True)
    account_created: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    last_login: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True


# SQLModel for ORM mapping, including hashed_password and disabled fields
class Users(BaseUser):
    hashed_password: str
    disabled: Optional[bool] = False


# Input model including password validation
class UserIn(BaseModel):
    username: str
    first_name: Optional[str] = None
    email: EmailStr
    password: str = Field(..., min_length=8)

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
    id: Optional[PydanticObjectId] = Field(
        default_factory=PydanticObjectId, alias="_id"
    )


# Model for updating user information
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    password: Optional[str] = None


class Income(Document):
    id: Optional[PydanticObjectId] = Field(
        default_factory=PydanticObjectId, alias="_id"
    )
    amount: float = Field(
        default=0.0
    )  # When a user first creates an account they start with zero so th
    recent_pay: date = Field(index=True)  # Ensuring this is a date object
    last_pay: Optional[date] = None

    user_id: Link[Users]

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True

    class Settings:
        keep_nulls = False


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


# passed incomebase to reduce extra validation
class IncomeUpdate(IncomeBase):
    amount: Optional[float] = None
    recent_pay: Optional[date] = None
    last_pay: Optional[date] = None


class Expense(Document):
    id: Optional[PydanticObjectId] = Field(
        default_factory=PydanticObjectId, alias="_id"
    )
    name: str = Field(index=True)
    amount: float = Field(index=True)
    due_date: Optional[int] = Field(
        default=None, ge=1, le=31, index=True
    )  # Due date of the expense (days of the month(1-30 or 31))
    category_name: Optional[str] = None

    user_id: Link[Users]
    income_id: Link[Income]
    category: Optional[Link[Category]] = None

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True

    class Settings:
        keep_nulls = False


class ExpenseBase(BaseModel):
    name: str
    amount: float
    due_date: Optional[int]
    category_name: Optional[str] = None

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


# Pydantic Models for Request Validation and Serialization
class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[int] = None
    category_name: Optional[str] = None
