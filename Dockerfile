#Client setup
FROM node:13.7.0-alpine as build

RUN mkdir -p /app/client
WORKDIR /app/client

ENV PATH /app/client/node_modules/.bin:$PATH

COPY ./client/package.json /app/client
COPY ./client/package-lock.json /app/client

RUN npm install --silent
RUN npm install react-scripts@3.4.0 -g --silent

COPY ./client /app/client

RUN npm run build

#Node Setup
FROM node:13.7.0-alpine

RUN mkdir -p /app/server

WORKDIR /app/

COPY --from=build /app/client/build/ ./client/build/

WORKDIR /app/server

COPY ./server/package.json /app/server
COPY ./server/package-lock.json /app/server

RUN npm install --silent

COPY ./server /app/server

ENV PORT 8080
EXPOSE 8080

CMD [ "npm", "start" ]