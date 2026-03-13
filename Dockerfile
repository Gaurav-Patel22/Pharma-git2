FROM nginx:latest

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy only public folder to nginx
COPY ./public . /usr/share/nginx/html/
COPY server/package*.json ./
COPY  public/signup.js ./
EXPOSE 80