  
FROM node:10.18.0-buster AS build-env
ADD . /work
WORKDIR /work


COPY package.json /work/

RUN yarn

COPY . /work/

EXPOSE 3000

CMD  ["yarn", "preTest", "GANACHE_DOCKER", "&&", "yarn", "start:test]
