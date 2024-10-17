from fastapi import APIRouter

from .get_cars import get_cars
from .get_marks_and_models import get_marks_and_models
catalog_router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"]
)

catalog_router.add_api_route(
    "/get_cars",
    get_cars,
    methods=['POST']
)

catalog_router.add_api_route(
    "/get_all_marks_and_models",
    get_marks_and_models,
    methods=['GET']
)