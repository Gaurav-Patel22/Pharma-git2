FROM nginx:latest

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy only website files (not project folder)
COPY . /usr/share/nginx/html/

# Fix file permissions
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80