FROM nginx:latest

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy only public folder to nginx
COPY public 

EXPOSE 80