FROM nginx:1.21.1

RUN sed -i '/json;$/ a application/manifest+json webmanifest;' /etc/nginx/mime.types
COPY deploy/docker/default.conf /etc/nginx/conf.d/default.conf
COPY src /usr/share/nginx/html
