FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# Install Java
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless && \
    apt-get clean
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/

# FastAPI settings
ENV WEB_CONCURRENCY=1

# Specify dataset (ml-latest or ml-latest-small)
ARG DATASET=ml-latest-small

# Download dataset
RUN mkdir -p /dataset && \
    wget -O /tmp/dataset.zip http://files.grouplens.org/datasets/movielens/${DATASET}.zip && \
    unzip /tmp/dataset.zip -d /tmp/dataset && \
    mv /tmp/dataset/${DATASET}/* /dataset
ENV DATA_DIR=/dataset

# Install poetry
RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false

# Install dependencies
COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry install --no-root --no-dev

# Copy app
COPY ./app /app