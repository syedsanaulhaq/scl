# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire backend source
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD npm run health || exit 1

# Start application
CMD ["npm", "run", "dev"]
