from pathlib import Path
import pandas as pd
from pyspark import SparkContext
from pyspark.sql import SparkSession, DataFrame
import pyspark.sql.functions as F
import pyspark.sql.types as T
import os
import typing
import shutil

from log import logger
from recommendations import generate_all_recommendations

DATA_DIR = Path(os.getenv("DATA_DIR", "/dataset"))
TABLES = ["links", "movies", "ratings", "tags", "recommendations"]

SparkContext.setSystemProperty('spark.executor.memory', '2g')
spark = SparkSession.builder\
    .master(os.getenv("SPARK_MASTER", "local"))\
    .appName("movie-app")\
    .getOrCreate()


def read_df(file: str, types: dict) -> DataFrame:
    schema = T.StructType([
        T.StructField(name, get_dtype(dtype), True)
        for (name, dtype) in types.items()
    ])
    df = spark.read\
        .format("csv")\
        .option("header", "true")\
        .schema(schema)\
        .load(str(DATA_DIR / file))
    return df


def get_dtype(dtype):
    return {
        str: T.StringType(),
        int: T.IntegerType(),
        float: T.FloatType(),
        bool: T.BooleanType(),
        "time": T.TimestampType()
    }[dtype]


def load_and_preprocess_csv():
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
                                     F.regexp_extract(
                                         "title", r"\((\d{4})\)$", 1)
                                     .cast(T.IntegerType()))
    # Remove year from title (if extracted)
    df_movies = df_movies.withColumn("title",
                                     F.when(F.isnan(F.col("year")),
                                            F.col("title"))
                                     .otherwise(F.expr("substring(title, 0, length(title)-7)")))
    # Explode genres
    df_movies = df_movies.withColumn("genres",
                                     F.split("genres", "\|"))

    # Train recommender and compute all recommendations
    df_recommendations = generate_all_recommendations(df_ratings)

    return {"links": df_links,
            "movies": df_movies,
            "ratings": df_ratings,
            "tags": df_tags,
            "recommendations": df_recommendations}


def save_to_parquet(dfs: typing.Dict[str, DataFrame]):
    for name, df in dfs.items():
        filename = str(DATA_DIR / f"{name}.parquet")
        logger.info(f"Saving {filename}")
        df.write.parquet(str(filename))


def load_from_parquet() -> typing.Dict[str, DataFrame]:
    return {
        name: spark.read.parquet(str(DATA_DIR / f"{name}.parquet"))
        for name in TABLES
    }


def load_or_recreate_from_parquet() -> typing.Dict[str, DataFrame]:
    # Check if all parquet files exist (or we are forced to recompute anyway)
    if os.getenv("FORCE_RECOMPUTE_DATASET", False) or \
            not all((DATA_DIR / f"{name}.parquet").exists() for name in TABLES):
        # Not all parquet files exist, so we will recreate them
        for name in TABLES:
            shutil.rmtree(DATA_DIR / f"{name}.parquet", ignore_errors=True)
        dfs = load_and_preprocess_csv()
        save_to_parquet(dfs)
    return load_from_parquet()
