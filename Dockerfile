FROM node:10.18.0-buster AS build-env
RUN apt-get install -y git 
RUN mkdir /build
RUN cd /build && git clone https://github.com/RTradeLtd/ens-app.git
RUN cd /build/ens-app && \
    git pull && \
    git checkout dev && \
    yarn && \
    yarn build
FROM nginx:1.17.6-alpine
COPY --from=build-env /build/ens-app/build /var/www/ens-app
COPY docker-files/nginx/ens_app.conf /etc/nginx/conf.d/ens_app.conf
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80/tcp
CMD ["nginx", "-g", "daemon off;"]