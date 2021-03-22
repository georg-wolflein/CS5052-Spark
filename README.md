# CS5052-Spark

Our project for CS5052.

## Tasks

- [ ] Store dataset using the methods supported in Spark
- [x] Search user by id, show the number of movies/genre that they have watched
  - [x] Given a list of users, search all movies watched by each user
- [x] Search movie by id/title, show the average rating & the number of users that have watched the movie
- [x] Search genre, show all movies in that genre
  - [x] Given a list of genres, search all movies belonging to each genre
- [x] Search movies by year
- [x] List the top n movies with highest rating, ordered by the rating
- [x] List the top n movies with the highest number of watches, ordered by the number of watches

- [x] Find the favourite genre of a given user, or group of users. Consider and justify how you will define ‘favourite’.
- [x] Compare the movie tastes of two users. Consider and justify how you will compare and present the data.

- [ ] Cluster users by movie taste.
- [ ] Visualisation and interaction of the data set, using external libraries
- [ ] Provide movie recommendations, e.g., user x liked movies A, B and C therefore they might like movies X, Y and Z.

## Running

We use the `poetry` build system, install it and update dependencies as shown:
```
pip install poetry
poetry install
```

After doing this, you'll need to start up the backend API, for information on how to do this please see the **Backend API** section below.

Finally, we use `react` as a frontend framework. After starting the backend, you'll need to start up the frontend from the `frontend` folder:
```
npm i
npm start
```

You can now access the website from [`http://localhost:3000`](http://localhost:3000).

## Backend API

The backend API may either be run in development (`dev`) or production (`prod`) mode.
In `dev` mode, the Python code is mounted in a volume, and the API server is restarted with each code change.
In `prod` mode, the Python code is baked into the Docker image and cannot be modified.

### Production mode

To run the backend API in `prod` mode, run the following command (from the root folder of this repository):

```
docker-compose -f docker-compose.prod.yml up -d --build
```

This will start a local development server at http://localhost:5000.
To access the API documentation, open http://localhost:5000/docs in your browser.

### Development mode

To instead run the API server in `dev` mode, run:

```
docker-compose -f docker-compose.dev.yml up -d --build
```

Note that the development version uses a mounted volume which means that you must share the relevant folder (i.e. the root directory of this repository) with docker.
See instructions [here](https://docs.docker.com/docker-for-windows/#file-sharing).
