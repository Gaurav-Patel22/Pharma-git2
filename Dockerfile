FROM nginx:latest
COPY public/ /usr/share/nginx/html/
COPY . .
EXPOSE 80
