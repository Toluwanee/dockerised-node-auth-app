
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
