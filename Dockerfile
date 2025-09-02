# Use Node.js LTS
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production PORT=8081 TRANSPORT=streamablehttp RESOURCES_TO_TOOLS=true

# Start the server
CMD ["./node_modules/.bin/tsx", "."]