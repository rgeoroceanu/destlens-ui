FROM nginx:1.23.2
COPY ./deployment/nginx/* /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY ./build /usr/share/nginx/html