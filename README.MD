# CapTrivia Application

This project consists of both a backend (BE) and a frontend (FE) service. The backend is packaged as a Docker image, and the frontend is a Vite app that will be built and served through Docker.

## Prerequisites

Before running the application, make sure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## How to Run

### Step 1: Load the Backend Docker Image

The backend image is pre-built and packaged as `captrivia-be-arm64.tar`. To load the image into Docker, run the following command:

```bash
docker load < captrivia-be-arm64.tar
```

### Step 2: Start the Services

Once the backend image is loaded, you can start both the backend and frontend services using Docker Compose. Run the following command from the root directory of the project:

```bash
docker-compose up
```

This will:
- Start the backend service on http://localhost:8080
- Build and start the frontend service (Vite app) on http://localhost:3000

### Stopping the Services

To stop both services, run the following command:

```bash
docker-compose down
```

