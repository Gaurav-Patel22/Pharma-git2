FROM nginx:latest

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy entire project to nginx folder
COPY . /usr/share/nginx/html/

EXPOSE 80