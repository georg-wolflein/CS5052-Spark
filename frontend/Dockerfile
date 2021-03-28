FROM node:15.2.0 as base

RUN mkdir -p /app
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
CMD npm start

FROM base as dev 
VOLUME /app/src
VOLUME /app/public

FROM base as prod
COPY src/ /app/src
COPY public/ /app/public