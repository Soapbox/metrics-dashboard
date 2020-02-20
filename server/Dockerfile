#React Setup
FROM node:13.7.0-alpine

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package.json /app/server
COPY package-lock.json /app/server

RUN npm install

COPY . /app/server

EXPOSE 3002
CMD [ "npm", "start" ]
