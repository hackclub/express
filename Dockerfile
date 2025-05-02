# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY app/ .

# Copy static assets
COPY static/ ../static/

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"] 