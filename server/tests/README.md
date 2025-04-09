# Running Tests

1. Make sure you are in the /server directory
2. Build the docker image:
   ```bash
   docker build -t capstone-server-dev -f Dockerfile.dev .
   ```
3. Start the container:
   ```bash
   docker run --rm -p 3000:3000 -e DB_NAME=test --volume ./src:/server/src --name capstone-server-dev-container capstone-server-dev
   ```
   for Windows there is different syntax for mounting a volume, instead use:
   ```bash
   docker run --rm -p 3000:3000 -e DB_NAME=test --volume "F:/Capstone/Group_16/server/src:/server/src" --name capstone-server-dev-container capstone-server-dev
   ```
4. Open a new terminal window and attach an interactive shell to the running container:
   ```bash
   docker exec -it capstone-server-dev-container /bin/bash
   ```
5. Execute all tests
   ```bash
   PYTHONPATH=/server pytest tests/ -v
   ```

   to view debug messages run:
   ```bash
   PYTHONPATH=/server pytest tests/ -v --capture=no
   ```