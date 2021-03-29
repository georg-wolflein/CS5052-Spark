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

The website may either be run in development (`dev`) or production (`prod`) mode.
In `dev` mode, the Python code (for the backend) and JavaScript code (for the frontend) is mounted as volumes, and the frontend/backend servers are restarted with each code change.
In `prod` mode, all code is baked into the Docker image and cannot be modified.

### Production mode

To run the backend API in `prod` mode, run the following command (from the root folder of this repository):

```
docker-compose -f docker-compose.prod.yml up -d --build
```

To access the frontend, open http://localhost:3000 in your browser.
To access the API documentation, open http://localhost:3000/api/docs.

### Development mode

To instead run the API server in `dev` mode, run:

```
docker-compose -f docker-compose.dev.yml up -d --build
```

Note that the development version uses a mounted volume which means that you must share the relevant folder (i.e. the root directory of this repository) with docker.
See instructions [here](https://docs.docker.com/docker-for-windows/#file-sharing).

You can now access the website from [`http://localhost:3000`](http://localhost:3000).
Any changes to the frontend or backend code will restart the fronend and/or backend servers automatically.

To get console output on the frontend, simply follow the logs of the container running the frontend:
```
docker logs -f <container id>
```

## Search Interface

To search through the dataset, we have implemented a permissive search bar to display the results. This search bar allows the user to search using an input box (which controls the actual search query) & a dropdown option list (which controls the mode to search with).

Search methods are as follows:

- **Single user**: In user mode, a single integer (`id`) will display movie & genre statistics about the user with that id
- **Multiple users**: In user mode, a comma separated list of integers (`ids`) will display the movie & genre statistics of **the collection of users** including their favourite genre as a group
  - If only 2 users are specified, we additionally show a visualisation of the differences between their movie tastes
- **Single movie**: In movie mode, a single integer (`id`) or string (`title`) will display the average rating of that movie, as well as the number of users who have watched that movie
- **Genres**: In genre mode, a comma separated list of strings (`genres`) will show the list of movies with that genre

Advanced tasks such as clustering or visualisations of the dataset as a whole will be given in an additional page. The movie recommendations will probably be added to the single user search mode.
