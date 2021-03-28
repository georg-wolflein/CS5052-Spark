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
              version=__version__,
              docs_url="/api/docs",
              openapi_url="/api/docs/openapi.json")
router = APIRouter(prefix="/api")


class Version(BaseModel):
    api: str


class Movie(BaseModel):
    movieId: int
    title: str
    year: typing.Optional[int]
    genres: typing.List[str]


class WatchedMovie(Movie):
    count: int


class RatedMovie(WatchedMovie):
    rating: float


def to_base_model_type(cls, row: Row):
    return cls(**{field: row[field]
                  for field in cls.__fields__})


@router.get("/version",
            description="Obtain the API version.",
            response_model=Version)
def get_version():
    return {"api": __version__}


@router.get("/users/{user_id}/genres",
            tags=["users"],
            description="Given a user, get the number of movies watched per genre.",
            response_model=typing.Dict[str, int])
@dictify
def search_user(user_id: int):
    return data.search_user(user_id).collect()


@router.get("/movies/search/title",
            tags=["movies"],
            description="Search for a movie by title",
            response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_title(title: str):
    return data.search_movies_by_title(title).collect()


@router.get("/movies/search/year",
            tags=["movies"],
            description="Search for a movie by year",
            response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_year(year: int):
    return data.search_movies_by_year(year).collect()


@router.post("/movies/search/users",
             tags=["movies"],
             description="Given a list of users, search all movies watched by each user.",
             response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_users(user_ids: typing.List[int]):
    return data.search_movies_by_users(user_ids).collect()


@router.post("/movies/search/genres",
             tags=["movies"],
             description="Given a list of genres, search all movies belonging each genre.",
             response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_genres(genres: typing.List[str]):
    return data.search_movies_by_genres(genres).collect()


@router.get("/movies/{movie_id}/watched",
            tags=["movies"],
            description="Get the number of users that have watched the movie.",
            response_model=int)
def get_number_of_views_for_movie(movie_id: int):
    return data.get_number_of_views_for_movie(movie_id)


@router.get("/movies/{movie_id}/rating",
            tags=["movies"],
            description="Get the average rating of the movie.",
            response_model=float)
def get_rating_for_movie(movie_id: int):
    return data.get_rating_for_movie(movie_id)


@router.get("/movies/top/rated/{n}",
            tags=["movies"],
            description="List the top N movies with highest rating, ordered by the rating.",
            response_model=typing.List[RatedMovie])
@listify
@mapify(partial(to_base_model_type, RatedMovie))
def top_n_movies_by_rating(n: int):
    return data.top_n_movies_by_rating(n).collect()


@router.get("/movies/top/watched/{n}",
            tags=["movies"],
            description="List the top N movies with the highest number of watches, ordered by the number of watches.",
            response_model=typing.List[WatchedMovie])
@listify
@mapify(partial(to_base_model_type, WatchedMovie))
def top_n_movies_by_watch_count(n: int):
    return data.top_n_movies_by_watch_count(n).collect()


app.include_router(router)
