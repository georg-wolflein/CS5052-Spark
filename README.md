# CS5052-Spark

Our project for CS5052.

## Running

The website may either be run in development (`dev`) or production (`prod`) mode.
In `dev` mode, the Python code (for the backend) and JavaScript code (for the frontend) is mounted as volumes, and the frontend/backend servers are restarted with each code change.
In `prod` mode, all code is baked into the Docker image and cannot be modified.

### Production mode

To run the backend API in `prod` mode, run the following command (from the root folder of this repository):

```
docker-compose -f docker-compose.prod.yml up -d --build
```

You can open the following links in your browser:
- frontend UI: http://localhost:3000
- backend API documentation: http://localhost:3000/api/docs
- Spark UI of Spark master: http://localhost:8080

In production mode, `docker-compose` will start the following five containers:
- frontend UI
- backend API
- Spark master
- Spark worker (1)
- Spark worker (2)

Note that in development mode, it will only start the frontend UI and backend API containers, and Spark will be hosted locally inside the backend API container using 6 threads.

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