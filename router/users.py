from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Users, UserIn, UserOut, UserUpdate
from database import get_db, engine
from datetime import  datetime
from typing import Annotated
from auth import oauth2_scheme, get_current_user, get_password_hash

router = APIRouter()


@router.post("/user", response_model=UserOut)
def add_user(user: UserIn, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)  # Ensure you have a function to hash passwords
    db_user = Users(username=user.username, email=user.email, hashed_password=hashed_password, first_name=user.first_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



@router.get("/user/me", response_model=UserOut)
async def read_user_me(current_user: Users = Depends(get_current_user)):
    return current_user

@router.get("/user/{user_id}", response_model=UserOut)
async def read_user(user_id: str, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result 

@router.put("/user/{user_id}", response_model=UserOut)
async def update_user(user_id: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = user_update.model_dump(exclude_unset=True)
    for key, value in updated_user.items():
        setattr(result, key, value)
    db.add(result) 
    db.commit()
    db.refresh(result)
    return result

@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(result)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)