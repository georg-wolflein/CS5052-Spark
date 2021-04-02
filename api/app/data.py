from pathlib import Path
import pandas as pd
from pyspark.sql import SparkSession, DataFrame
import pyspark.sql.functions as F
import os
from pyspark.sql.types import StringType, IntegerType, BooleanType, FloatType, TimestampType

DATA_DIR = Path(os.getenv("DATA_DIR", "/dataset"))

spark = SparkSession.builder\
    .master("local")\
    .appName("Word Count")\
    .getOrCreate()


def read_df(file: str, types: dict):
    df = spark.read\
        .format("csv")\
        .option("header", "true")\
        .load(str(DATA_DIR / file))
    return set_dtypes(df, types)


def set_dtypes(df, types: dict):
    for column, dtype in types.items():
        dtype = {
            str: StringType(),
            int: IntegerType(),
            float: FloatType(),
            bool: BooleanType(),
            "time": TimestampType()
        }[dtype]
        df = df.withColumn(column, F.col(column).cast(dtype))
    return df


df_links = read_df("links.csv", {
    "movieId": int,
    "imdbId": int,
    "tmdbId": int
})
df_movies = read_df("movies.csv", {
    "movieId": int,
    "title": str,
    "genres": str
})
df_ratings = read_df("ratings.csv", {
    "userId": int,
    "movieId": int,
    "rating": float,
    "timestamp": "time"
})
df_tags = read_df("tags.csv", {
    "userId": int,
    "movieId": int,
    "tag": str,
    "timestamp": "time"
})

# Remove whitespaces at beginning/end of titles
df_movies = df_movies.withColumn("title",
                                 F.trim("title"))
# Extract year from title
df_movies = df_movies.withColumn("year",
                                 F.regexp_extract("title", r"\((\d{4})\)$", 1)
                                 .cast(IntegerType()))
# Remove year from title (if extracted)
df_movies = df_movies.withColumn("title",
                                 F.when(F.isnan(F.col("year")), F.col("title"))
                                 .otherwise(F.expr("substring(title, 0, length(title)-7)")))
# Explode genres
df_movies = df_movies.withColumn("genres",
                                 F.split("genres", "\|"))


def search_user(user_id: int) -> DataFrame:
    """Given a user, get the number of movies watched per genre."""
    rated_movies = df_ratings.filter(
        df_ratings.userId == user_id).select("movieId").distinct()
    tagged_movies = df_tags.filter(
        df_tags.userId == user_id).select("movieId").distinct()
    movies = rated_movies.union(tagged_movies).distinct().join(
        df_movies, on=["movieId"], how="inner")
    movies = movies.select(movies.movieId, F.explode(
        movies.genres).alias("genre"))
    movies = movies.groupBy("genre").count()
    return movies


def search_movies_by_title(title: str) -> DataFrame:
    movies = df_movies.filter(f"LOWER(title) LIKE '%{title.lower()}%'")
    return movies


def search_movies_by_users(user_ids: [int]) -> DataFrame:
    """Given a list of users, search all movies watched by each user."""
    rated_movies = df_ratings.filter(df_ratings.userId.isin(user_ids))
    tagged_movies = df_tags.filter(df_tags.userId.isin(user_ids))
    movies = rated_movies.join(
        tagged_movies, on=["userId", "movieId"], how="outer")
    movies = movies.select("userId", "movieId").distinct()
    movies = movies.groupBy("movieId")\
        .count()\
        .join(df_movies, on=["movieId"])\
        .filter(f"count = {len(user_ids)}")\
        .drop("count")
    return movies


def get_number_of_views_for_movie(movie_id: int) -> int:
    """Search movie by id, show the number of users that have watched the movie."""
    rated_movies = df_ratings.where(f"movieId = {movie_id}")
    tagged_movies = df_tags.where(f"movieId = {movie_id}")
    movies = rated_movies.join(tagged_movies, on=["userId"], how="outer")
    movies = movies.select("userId").distinct()
    return movies.count()


def get_rating_for_movie(movie_id: int) -> float:
    """Search movie by id, show the average rating."""
    rated_movies = df_ratings.where(
        f"movieId = {movie_id}").agg({"rating": "avg"})
    return rated_movies.first()[0]


def search_movies_by_genres(genres: [str]) -> DataFrame:
    """Given a list of genres, search all movies belonging each genre."""
    n = len(genres)
    genres = F.array([F.lit(x) for x in genres])
    return df_movies.filter(
        F.size(F.array_intersect(F.col("genres"), genres)) == n)


def search_movies_by_year(year: int) -> DataFrame:
    """Search movies by year."""
    return df_movies.filter(F.col("year") == year)


def top_n_movies_by_rating(n: int) -> DataFrame:
    """List the top N movies with highest rating, ordered by the rating."""
    return df_ratings.groupBy("movieId")\
        .agg(F.avg("rating").alias("rating"), F.count("movieId").alias("count"))\
        .join(df_movies, on=["movieId"], how="inner")\
        .sort(F.col("rating").desc(), F.col("count").desc())\
        .limit(n)
    return top_n


def top_n_movies_by_watch_count(n: int):
    """List the top N movies with the highest number of watches, ordered by the number of watches.

    NOTE: watch count for one movie is total number of people who rated or tagged the movie at least once
    """
    return df_ratings.join(df_tags, on=["userId", "movieId"], how="outer")\
        .select("userId", "movieId").distinct()\
        .groupBy("movieId").count().join(df_movies, on=["movieId"])\
        .sort(F.col("count").desc())\
        .limit(n)


def favourite_genre(user_ids: [int]):
    """Find the favourite genre of a given user, or group of users. 

    NOTE: we define "favourite" as the most frequent genre among all "watched" movies
    """
    rated_movies = df_ratings.filter(df_ratings.userId.isin(user_ids))
    tagged_movies = df_tags.filter(df_tags.userId.isin(user_ids))
    movies = rated_movies.join(tagged_movies,
                               on=["userId", "movieId"],
                               how="outer")
    movies = movies.select("userId", "movieId").distinct()
    movies = movies.groupBy("movieId").count().join(df_movies, on=["movieId"])
    movies = movies.select(movies.movieId, F.explode(movies.genres).alias("genre"))\
        .groupBy("genre").count()\
        .sort(F.col("count").desc())
    return movies.limit(1).select("genre")


def _normalize_genres(df_genres: pd.DataFrame, genres: set) -> pd.DataFrame:
    """Utility function."""
    for genre in genres - set(df_genres.genre):
        df_genres = df_genres.append(
            {"genre": genre, "count": 0}, ignore_index=True)
    df_genres["percentage"] = df_genres["count"] / \
        df_genres["count"].sum() * 100
    return df_genres


def compare_movie_tastes(user1: int, user2: int):
    """Compare the movie tastes of two users.

    NOTE: the output will be presented as a bar chart of percentages.
    """
    user1_genres = search_user(user1).toPandas()
    user2_genres = search_user(user2).toPandas()
    user2_genres = user2_genres.drop(index=[0, 1])
    genres = set(user1_genres.genre).union(user2_genres.genre)
    user1_genres = _normalize_genres(user1_genres, genres)
    user2_genres = _normalize_genres(user2_genres, genres)
    user1_genres["percentage_user2"] = user2_genres["percentage"]
    user1_genres = user1_genres.rename(
        columns={"percentage": "percentage_user1"})
    return user1_genres.drop(columns=["count"])
