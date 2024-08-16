from fastapi import APIRouter, Depends, status

from models import Income, IncomeBase, IncomeUpdate
from Services.income_service import IncomeService

router = APIRouter()


def get_income_service() -> IncomeService:
    return IncomeService()


@router.post(
    "/income/{user_id}", response_model=Income, status_code=status.HTTP_201_CREATED
)
async def add_income(
    income_data: IncomeBase,
    user_id: int,
    service: IncomeService = Depends(get_income_service),
):
    return await service.add_income(income_data, user_id)


@router.get("/income/{user_id}", response_model=list[Income])
async def read_all_incomes(
    user_id: int, service: IncomeService = Depends(get_income_service)
):
    return await service.read_all_incomes(user_id)


@router.put("/income/{income_id}", response_model=Income)
async def update_income(
    income_id: int,
    income_data: IncomeUpdate,
    service: IncomeService = Depends(get_income_service),
):
    return await service.update_income(income_id, income_data)
