from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Users, UserIn, UserOut
from database import get_db, engine
from datetime import  datetime
from typing import Annotated
from auth import oauth2_scheme

router = APIRouter()


@router.post("/user", response_model=UserOut)
def add_user(user: UserIn, db: Session = Depends(get_db)):
    hashed_password = hashed_password(user.hashed_password)  # Ensure you have a function to hash passwords
    db_user = Users(username=user.username, email=user.email, hashed_password=hashed_password, first_name=user.first_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/user/me", response_model=UserOut)
async def read_user_me(current_user: Annotated[str,Depends(oauth2_scheme)]):
    return current_user

@router.get("/user/{user_id}", response_model=Users)
async def read_user(user_id: str):
    return {"user_id": user_id}

@router.put("/user/{user_id}", response_model=Users)
async def update_user(user_id: str):
    return {"user_id": user_id}

@router.delete("/user/{user_id}", response_model=Users)
async def delete_user(user_id: str):
    return {"user_id": user_id}