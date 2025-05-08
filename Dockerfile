FROM node:20-slim

# Install NGINX and dumb-init
RUN apt-get update && \
    apt-get install -y nginx dumb-init && \
    rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /usr/src/app

# Copy backend files
COPY app/package*.json ./
RUN npm install
COPY app/ .

# Copy frontend static files to NGINX root
COPY static/ /usr/src/static

# Copy NGINX config
COPY nginx/default.conf /etc/nginx/sites-available/default

# Replace the default nginx site
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Expose HTTP port
EXPOSE 80

# Start both Node and NGINX using dumb-init
CMD ["dumb-init", "sh", "-c", "node app.js & nginx -g 'daemon off;'"]
