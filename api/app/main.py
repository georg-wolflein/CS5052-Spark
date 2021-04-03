from fastapi import FastAPI, APIRouter
import typing
import logging
from functools import partial
from pydantic import BaseModel
from pyspark.sql import Row

from __version__ import __version__
import model
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


class Genre(BaseModel):
    genre: typing.Optional[str]


class GenreComparison(BaseModel):
    genre: str
    percentage_user1: float
    percentage_user2: float


class Graph(BaseModel):
    nodes: list
    edges: typing.List[dict]


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
    return model.search_user(user_id).collect()


@router.get("/movies/search/title",
            tags=["movies"],
            description="Search for a movie by title",
            response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_title(title: str):
    return model.search_movies_by_title(title).collect()


@router.get("/movies/search/year",
            tags=["movies"],
            description="Search for a movie by year",
            response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_year(year: int):
    return model.search_movies_by_year(year).collect()


@router.post("/movies/search/users",
             tags=["movies"],
             description="Given a list of users, search all movies watched by each user.",
             response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_users(user_ids: typing.List[int]):
    return model.search_movies_by_users(user_ids).collect()


@router.post("/movies/search/genres",
             tags=["movies"],
             description="Given a list of genres, search all movies belonging each genre.",
             response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def search_movies_by_genres(genres: typing.List[str]):
    return model.search_movies_by_genres(genres).collect()


@router.get("/movies/{movie_id}/watched",
            tags=["movies"],
            description="Get the number of users that have watched the movie.",
            response_model=int)
def get_number_of_views_for_movie(movie_id: int):
    return model.get_number_of_views_for_movie(movie_id)


@router.get("/movies/{movie_id}/rating",
            tags=["movies"],
            description="Get the average rating of the movie.",
            response_model=float)
def get_rating_for_movie(movie_id: int):
    return model.get_rating_for_movie(movie_id)


@router.get("/movies/top/rated/{n}",
            tags=["movies"],
            description="List the top N movies with highest rating, ordered by the rating.",
            response_model=typing.List[RatedMovie])
@listify
@mapify(partial(to_base_model_type, RatedMovie))
def top_n_movies_by_rating(n: int):
    return model.top_n_movies_by_rating(n).collect()


@router.get("/movies/top/watched/{n}",
            tags=["movies"],
            description="List the top N movies with the highest number of watches, ordered by the number of watches.",
            response_model=typing.List[WatchedMovie])
@listify
@mapify(partial(to_base_model_type, WatchedMovie))
def top_n_movies_by_watch_count(n: int):
    return model.top_n_movies_by_watch_count(n).collect()


@router.post("/users/favourite/genre",
             tags=["users"],
             description="Find the favourite genre of a given user, or group of users.",
             response_model=Genre)
def find_users_favourite_genre(users: typing.List[int]):
    result = model.favourite_genre(users).first()
    return Genre(genre=result["genre"] if result else None)


@router.get("/users/compare/{user1}/{user2}/genres",
            tags=["users"],
            description="Compare the movie tastes of two users.",
            response_model=typing.List[GenreComparison])
def compare_movie_tastes(user1: int, user2: int):
    return model.compare_movie_tastes(user1, user2).to_dict("records")


@router.post("/users/graph/mutual_views",
             tags=["users"],
             description="Obtain a graph where the users are the nodes and the edges are weighted by the total number of movies a given pair of users both watched.",
             response_model=Graph)
def get_graph_of_number_of_movies_in_common_between_users(user_ids: typing.List[int]):
    nodes, edges = model.get_graph_of_number_of_movies_in_common_between_users(
        user_ids)
    edges = [{
        "from": orig,
        "to": dest,
        "weight": weight
    } for (orig, dest), weight in edges.items()]
    return Graph(nodes=nodes, edges=edges)


@router.get("/users/{user_id}/recommendations",
            tags=["users"],
            description="Obtain movie recommendations for a user.",
            response_model=typing.List[Movie])
@listify
@mapify(partial(to_base_model_type, Movie))
def get_movie_recommendations(user_id: str):
    return model.get_movie_recommendations(user_id).collect()


app.include_router(router)
