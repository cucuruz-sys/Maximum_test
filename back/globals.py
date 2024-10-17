from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
import pymongo
from bson.objectid import ObjectId
from config import config
from pymongo import MongoClient
from fastapi.responses import JSONResponse

################################################################################

MONGODB_HOST = config.get("mongodb")["url"]
MONGODB_DATABASE = config.get("mongodb")["database"]
MONGODB_CARS_COLLECTION = config.get("mongodb")["cars_collection"]
MONGODB_CLIENT = pymongo.MongoClient(MONGODB_HOST)

################################################################################

FASTAPI_SECRET_KEY = "213513245"



def get_cars_from_db(model, mark) -> list:
    try:
        cars_collection = MONGODB_CLIENT[MONGODB_DATABASE][MONGODB_CARS_COLLECTION]
        query = {"mark": mark, "model": model}
        cars = list(cars_collection.find(query))
        return cars

    except Exception as e:
        print(f"An error occurred: {e}")
        return []


def get_all_cars() -> dict:
    try:
        cars_collection = MONGODB_CLIENT[MONGODB_DATABASE][MONGODB_CARS_COLLECTION]
        pipeline = [
            # Этап фильтрации данных с проверкой на null
            {
                "$match": {
                    "mark": {"$ne": None},
                    "model": {"$ne": None}
                }
            },
            {
                "$group": {
                    "_id": "$mark",
                    "models": {"$addToSet": "$model"}
                }
            }
        ]

        results = list(cars_collection.aggregate(pipeline))
        cars_dict = {result["_id"]: result["models"] for result in results}
        return cars_dict

    except Exception as e:
        print(f"An error occurred: {e}")
        return {}