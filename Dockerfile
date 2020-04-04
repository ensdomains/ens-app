  
FROM node:10.18.0-buster AS build-env
ADD . /work
WORKDIR /work

# Clone and install utils
RUN apt-get update
RUN apt-get install -y gawk libsecret-1-dev
RUN git clone https://github.com/vishnubob/wait-for-it \
    && cp wait-for-it/wait-for-it.sh /usr/local/bin \
    && chmod +x /usr/local/bin/wait-for-it.sh \
    && rm -rf wait-for-it

# Setup ens-app

RUN  mkdir /work/ens-app

COPY package.json /work/ens-app/

RUN cd /work/ens-app && yarn && cd ..

COPY . /work/ens-app/

EXPOSE 3000

# Setup ens-subgraph

RUN git clone https://github.com/ensdomains/ens-subgraph.git \
    && cd ens-subgraph \
    && yarn

CMD cd /work/ens-app && yarn preTest GANACHE_DOCKER && yarn subgraph \
    &&  /usr/local/bin/wait-for-it.sh ens-app_graph-node_1:8020 -t 30 \
    && cd /work/ens-subgraph && yarn docker:setup \
    && cd /work/ens-app && yarn start:test
