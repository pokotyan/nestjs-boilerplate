FROM node:12.13-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:12.13-alpine as production

# for health check
RUN apk update && apk add curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 3000