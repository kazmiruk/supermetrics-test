FROM node:15.9.0-alpine as base

RUN apk add curl

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install
