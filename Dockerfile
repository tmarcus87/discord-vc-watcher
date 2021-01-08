FROM node:12

RUN mkdir /app

COPY ./ /app

RUN cd /app && \
  npm install && \
  ls -l / && \
  ls -l /app && \
  ls -l /app/node_modules

WORKDIR /app

ENTRYPOINT [ "node", "index.js" ]
