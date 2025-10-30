# Use an official lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions first
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose the app port (from your .env)
EXPOSE 3003

# Use environment variables from Docker or Compose
CMD ["npm", "start"]
