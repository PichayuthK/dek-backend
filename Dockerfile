FROM node:6-alpine
EXPOSE 3333
RUN apk add --update tini
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package.json

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps

COPY . .
CMD ["tini","--","node","./server/server.js"]