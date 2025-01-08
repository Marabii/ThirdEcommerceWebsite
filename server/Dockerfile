# Use official Node.js LTS version as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port (ensure it matches the PORT in your .env)
EXPOSE 3001

# Instruct Docker to run your key generation script,
# then start your backend server.
CMD ["sh", "-c", "node generateKeypair.js && npm run dev"]
