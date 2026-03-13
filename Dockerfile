FROM node:18

# Create app folder
WORKDIR /app

# Copy package files
COPY ./server/package*.json ./
COPY ./public . /usr/share/nginx/html/

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]