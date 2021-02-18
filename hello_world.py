from pathlib import Path
from pyspark.sql import SparkSession

DATA_DIR = Path("data/ml-latest-small")

spark = SparkSession.builder\
    .master("local")\
    .appName("Word Count")\
    .getOrCreate()

data = spark.read\
    .format("csv")\
    .option("header", "true")\
    .load(str(DATA_DIR / "links.csv"))
data = data.filter("movieId <= 100")
print("\n".join(map(str, data.collect())))