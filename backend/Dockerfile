FROM node:22-alpine3.21

RUN apk update && apk add bash && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

# CMD if [ "$$NODE_ENV" = "production" ] ; then npm run prod ; elif [ "$$NODE_ENV" = "staging" ] ; then npm run staging ; else npm run dev ; fi
