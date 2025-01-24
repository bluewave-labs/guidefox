FROM node:22-alpine3.21

RUN apk update && apk add bash && rm -rf /var/cache/apk/*

RUN apk update && apk add bash && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 4173

# CMD ["sh", "-c", "npm run build && npm run preview"]
