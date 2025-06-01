from fastapi import HTTPException


async def update_document_or_404(document, data):
    if not document:
        raise HTTPException(status_code=404, detail="Item not found")
    await document.update({"$set": data.model_dump(exclude_unset=True)})
    return document


def validate_object_id(object_id: str):
    from beanie import PydanticObjectId

    if not object_id or object_id == "null":
        raise HTTPException(status_code=400, detail="Invalid or missing ID")
    try:
        return PydanticObjectId(object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed ID")
