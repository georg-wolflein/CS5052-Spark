# CS5052-Spark
Our project for CS5052.

## Tasks
- [ ] Store dataset using the methods supported in Spark
- [x] Search user by id, show the number of movies/genre that they have watched
    - [x] Given a list of users, search all movies watched by each user
- [x] Search movie by id/title, show the average rating & the number of users that have watched the movie
- [x] Search genre, show all movies in that genre
    - [x] Given a list of genres, search all movies belonging to each genre
- [ ] Search movies by year
- [ ] List the top n movies with highest rating, ordered by the rating
- [ ] List the top n movies with the highest number of watches, ordered by the number of watches

- [ ] Find the favourite genre of a given user, or group of users. Consider and justify how you will define ‘favourite’.
- [ ] Compare the movie tastes of two users. Consider and justify how you will compare and present the data.

- [ ] Cluster users by movie taste.
- [ ] Visualisation and interaction of the data set, using external libraries
- [ ] Provide movie recommendations, e.g., user x liked movies A, B and C therefore they might like movies X, Y and Z.

## Running
We use the `poetry` build system, install this with `pip install poetry`.
After this, you can run our project via:
```
poetry run src/main.py
```