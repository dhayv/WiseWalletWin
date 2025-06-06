from constants import default_categories
from models import Category


async def prepopulate_categories():

    for cat in default_categories:
        existing = await Category.find_one(Category.name == cat["name"])
        if not existing:
            new_cat = Category(**cat)
            await new_cat.insert()
            print(f"Inserted category: {new_cat.name}")
        else:
            print(f"Category {cat['name']} already exists.")
