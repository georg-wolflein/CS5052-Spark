FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8 as base

# Install Java
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless && \
    apt-get clean
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/

# FastAPI settings
ENV WEB_CONCURRENCY=1

# Specify dataset (ml-latest or ml-latest-small)
ARG dataset=ml-latest-small

# Download dataset
RUN mkdir -p /dataset && \
    wget -O /tmp/dataset.zip http://files.grouplens.org/datasets/movielens/${dataset}.zip && \
    unzip /tmp/dataset.zip -d /tmp/dataset && \
    mv /tmp/dataset/${dataset}/* /dataset
ENV DATA_DIR=/dataset

# Install poetry
RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false

# Install dependencies
COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry install --no-root --no-dev

# Development
FROM base as dev
VOLUME /app
ENTRYPOINT /start-reload.sh

# Production
FROM base as prod
COPY ./app /app
ENTRYPOINT /start.sh