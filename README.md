# dockerised-node-auth-app

# 🚀 Node.js Secret Service Deployment with Docker & GitHub Actions (CI /CD)

This is a simple **Node.js web service** with two routes, Dockerized and deployed automatically to a remote server using **GitHub Actions**. It demonstrates how to use **CI/CD pipelines** to build, push, and deploy a Docker image.

---

## Prerequisites

Before you begin, make sure you have the following:

- Node.js and npm installed locally (for development)
- A [Docker Hub](https://hub.docker.com/) account
- A remote Linux server (e.g., Ubuntu on AWS EC2)
- Docker and Docker Compose installed on the remote server
- A `.env` file both locally and on the remote server
- SSH access to the server with a private key
- A GitHub repository for your code
- GitHub secrets configured for:
  -DOCKERHUB_TOKEN
DOCKER_USERNAME
SSH_PRIVATE_KEY
REMOTE_HOST	
REMOTE_USER

---

## Features

- `GET /` → Returns a simple "Hello, world!" message.
- `GET /secret` → Protected by Basic Auth. Returns a secret message if valid credentials are provided.
- Uses a `.env` file for:

```
USERNAME=admin
PASSWORD=pass1234
SECRET_MESSAGE=This is top secret!
```
- Dockerized with a multistage build setup.
- CI/CD via GitHub Actions to build, push, and deploy the image to a remote server.

---

## ⚙️ Environment Setup

Create a `.env` file in the root of your project:



---

## 🧪 Running Locally

### 1. Install Dependencies
```
npm install
```
### 2. Start the Server
```
node app.js
```


http://localhost:3000/ for Hello world.  [you can edit as desired, depending on what port is available on your host]

http://localhost:3000/secret → Will prompt for username and password




## Dockerization

### Dockerfile
```
ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Start the application.
CMD ["node", "app.js"]
```

### Build and Run with Docker

```
docker build -t node-secret-service .
docker run --env-file .env -p 3000:3000 node-secret-service
```

# Once everything works well proceed to github actions


## GitHub Actions (CI/CD)

🔐 Secrets Configuration
In your GitHub repo, go to Settings → Secrets and variables → Actions and add:

Name			Type		Description
DOCKERHUB_TOKEN	Secret		Docker Hub access token
DOCKER_USERNAME	Variable	Your Docker Hub username
SSH_PRIVATE_KEY	Secret		SSH key for your remote server
REMOTE_HOST		Variable	IP or domain of the server
REMOTE_USER		Variable	SSH username on the serve


### GitHub Workflow File
On your repo create a folder: .github/workflows/deploy.yml

Then add the following file to deploy.yml

```
name: Deploy Nodejs app to docker hub then remote server

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ vars.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ${{ vars.DOCKER_USERNAME }}/node-secret-service:latest

      - name: Execute remote SSH commands using password
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ vars.HOST }}
          username: ${{ vars.REMOTE_USERNAME }}
          key: ${{ secrets.PRIVATE_KEY }}
          script: |
            echo "USERNAME=admin" >> /home/${{ vars.REMOTE_USERNAME }}/.env
            echo "PASSWORD=pass1234" >> /home/${{ vars.REMOTE_USERNAME }}/.env
            echo "SECRET_MESSAGE=This is top secret!" >> /home/${{ vars.REMOTE_USERNAME }}/.env
            docker pull ${{ vars.DOCKER_USERNAME }}/node-secret-service:latest
            docker stop node-secret-service || true
            docker rm node-secret-service || true
            docker run -d --name node-secret-service -p 80:3000 \
              --env-file /home/${{ vars.REMOTE_USERNAME }}/.env \
              ${{ vars.DOCKER_USERNAME }}/node-secret-service:latest

```



## Workflow Triggers
The workflow is triggered on push to main:

`
on:
  push:
    branches:
      - main
`

It will:

Log in to Docker Hub

Build the Docker image

Push the image to Docker Hub

SSH into your server

Pull and run the new image



## Deployment Verification
After a successful push to main, your app should be available on:

http://your-server-ip:3000


📚 References
To be rewritten
Docker 

GitHub Actions

appleboy/ssh-action

Node.js + Basic Auth

dotenv


Author
Made with ❤️ by @toluwanee
