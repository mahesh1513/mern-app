**Setting Up a MERN Stack Application with Docker**

Prerequisites
Git: Installed on your machine.
Docker: Docker and Docker Compose must be installed on your system.
1. Clone the Repository
Start by cloning the MERN app repository to your local machine. Open your terminal and run the following command:

git clone https://github.com/mahesh1513/mern-app.git

This will create a local copy of the repository in a folder named mern-app.

2. Install Docker
If you don't have Docker installed, follow the official installation guide:

Docker Installation Guide
Ensure that Docker Compose is also installed, as it will be used to build and run the app's containers.

3. Build and Run the Application with Docker Compose
Navigate to the root directory of the project (where the docker-compose.yml file is located) and run the following command to build and start the containers:

docker-compose up --build

This command will:
Build the Docker images defined in the docker-compose.yml file.
Start the MongoDB, Express, React, and Node.js services.
Once the build is complete, the application should be accessible locally.

4. Accessing the App
Once the Docker containers are up and running, you can access the app by navigating to:
http://localhost:3000


Troubleshooting

Docker Not Running: Ensure Docker Desktop is running before using Docker commands.

Ports Conflict: If port 3000 is already in use, you may need to update the docker-compose.yml file to map a different port.
