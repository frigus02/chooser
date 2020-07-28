FROM nginx:1.19

COPY deploy/docker/default.conf /etc/nginx/conf.d/default.conf
COPY src /usr/share/nginx/html
