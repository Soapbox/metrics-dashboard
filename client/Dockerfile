#React Setup
FROM node:13.7.0-alpine

RUN mkdir -p /app/client
WORKDIR /app/client

COPY package.json /app/client
COPY package-lock.json /app/client

RUN npm install

COPY . /app/client

EXPOSE 3001

CMD [ "npm", "start" ]
