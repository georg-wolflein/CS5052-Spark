from fastapi import FastAPI, APIRouter
import typing
import logging
from functools import partial
from pydantic import BaseModel
from pyspark.sql import Row

from __version__ import __version__
import data
from utils import listify, dictify, mapify
from log import logger

app = FastAPI(title="Movie Backend API",
              version=__version__)
router = APIRouter(prefix="/api")


class Version(BaseModel):
    api: str


class Movie(BaseModel):
    movieId: int
    title: str
    year: int
    genres: typing.List[str]


def to_base_model_type(cls, row: Row):
    return cls(**{field: row[field]
                  for field in cls.__fields__})


@router.get("/version",
            description="Obtain the API version.",
            response_model=Version)
def get_version():
    return {"api": __version__}


@router.get("/users/{user_id}/genres",
            description="Given a user, get the number of movies watched per genre.",
            response_model=typing.Dict[str, int])
@dictify
def search_user(user_id: int):
    return data.search_user(user_id).collect()


@router.post("/users/movies/watched",
             description="Given a list of users, search all movies watched by each user.",
             response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_users(user_ids: typing.List[int]):
    return data.search_movies_by_users(user_ids).collect()


app.include_router(router)
