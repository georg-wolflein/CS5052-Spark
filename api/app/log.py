import logging
import os

LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
logger = logging.getLogger(f"gunicorn.error.movieapi")
logger.setLevel(LOG_LEVEL)
