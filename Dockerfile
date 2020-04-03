  
FROM node:10.18.0-buster AS build-env
RUN apt-get install -y git 
ADD . /work
WORKDIR /work

RUN git clone https://github.com/ensdomains/ens-app.git
RUN cd ens-app && \
    git checkout docker && \
    yarn && \
    yarn preTest GANACHE_DOCKER
EXPOSE 3000
CMD  ["yarn", "start:local"]
