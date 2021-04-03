from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.recommendation import ALS

from log import logger


def fit_model(df, reg_param, max_iter=5):
    als = ALS(maxIter=max_iter, regParam=1., userCol="userId", itemCol="movieId", ratingCol="rating",
              coldStartStrategy="drop")
    model = als.fit(df)
    return model


def evaluate_model(model, df):
    predictions = model.transform(df)
    evaluator = RegressionEvaluator(
        metricName="rmse", labelCol="rating", predictionCol="prediction")
    rmse = evaluator.evaluate(predictions)
    return rmse


def select_best_reg_param(df_training, df_test):
    best_rmse, best_reg_param = None, None
    for reg_param in (1., .1, .01):
        model = fit_model(df_training, reg_param)
        rmse = evaluate_model(model, df_test)
        if best_rmse is None or best_rmse > rmse:
            best_rmse, best_reg_param = rmse, reg_param
    return best_reg_param, best_rmse


def generate_all_recommendations(df_ratings, fast_mode: bool = True):
    logger.info("Generating movie recommendations")
    if fast_mode:
        model = fit_model(df_ratings, .5, max_iter=5)
    else:
        (df_training, df_test) = df_ratings.randomSplit([0.8, 0.2])
        reg_param, best_rmse = select_best_reg_param(df_training, df_test)
        model = fit_model(df_ratings, reg_param, max_iter=7)
        logger.info(
            f"Selected recommender model that achieved test RMSE of {best_rmse}")
    return model.recommendForAllUsers(5)
