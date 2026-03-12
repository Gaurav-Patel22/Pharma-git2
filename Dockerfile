FROM nginx:latest

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy complete project
COPY . /usr/share/nginx/html

EXPOSE 80