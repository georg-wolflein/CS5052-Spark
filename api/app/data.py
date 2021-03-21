from pathlib import Path
import pandas as pd
from pyspark.sql import SparkSession, DataFrame
import pyspark.sql.functions as sf
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
        df = df.withColumn(column, sf.col(column).cast(dtype))
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

df_movies = df_movies.withColumn("year",
                                 sf.substring(df_movies.title, -5, 4).cast(IntegerType()))
df_movies = df_movies.withColumn("title",
                                 sf.expr("substring(title, 0, length(title)-7)"))
df_movies = df_movies.withColumn("genres", sf.split("genres", "\|"))


def search_user(user_id: int) -> DataFrame:
    """Given a user, get the number of movies watched per genre."""
    rated_movies = df_ratings.filter(
        df_ratings.userId == user_id).select("movieId").distinct()
    tagged_movies = df_tags.filter(
        df_tags.userId == user_id).select("movieId").distinct()
    movies = rated_movies.union(tagged_movies).distinct().join(
        df_movies, on=["movieId"], how="inner")
    movies = movies.select(movies.movieId, sf.explode(
        sf.split(movies.genres, "\|")).alias("genre"))
    movies = movies.groupBy("genre").count()
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
