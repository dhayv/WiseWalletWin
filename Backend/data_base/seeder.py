from constants import default_categories
from models import Category


async def prepopulate_categories() -> None:
    for cat in default_categories:
        if not await Category.find_one(Category.name == cat["name"]):
            await Category(**cat).insert()
