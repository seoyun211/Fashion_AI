from fastapi import APIRouter
from .data_routes import router as data_router
from .image_search import router as image_search_router

router = APIRouter()

router.include_router(data_router, prefix="/data", tags=["data"])
router.include_router(image_search_router, tags=["image-search"]) 