
# Use an official lightweight Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
# This step is done separately to leverage Docker's layer caching
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the rest of your application's source code into the container
COPY . .

# Your application listens on port 8080, so expose it
EXPOSE 8080

# Define the command to run your application when the container starts
CMD ["node", "server.js"]

