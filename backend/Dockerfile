FROM node:22-alpine3.21

RUN apk update && apk add bash && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000