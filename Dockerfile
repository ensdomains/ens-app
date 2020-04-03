  
FROM node:10.18.0-buster AS build-env
RUN apt-get install -y git 
ADD . /work
WORKDIR /work

RUN git clone https://github.com/ensdomains/ens-app.git
RUN cd ens-app && \
    yarn && \
    yarn preTest GANACHE_DOCKER
EXPOSE 3000/tcp
CMD  ["yarn" "start:local"]
