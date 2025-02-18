# Running the server in **DEV** mode with **Docker**

While running in **DEV** mode, the changes made to `src` folder will be reflected in the docker container and the server will automatically restart.

1. Make sure you have `docker` installed and your `docker` engine is up and running

2. ```cd server```

3. ```sudo docker build -t capstone-server-dev -f Dockerfile.dev .```

4. ```sudo docker run --rm -p 3000:3000 --volume ./src:/server/src --name capstone-server-dev-container capstone-server-dev```