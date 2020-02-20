#React Setup
FROM node:13.7.0-alpine as build

RUN mkdir -p /app/client
WORKDIR /app/client

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/client
COPY package-lock.json /app/client

RUN npm install --silent
RUN npm install react-scripts@3.3.0 -g --silent

COPY . /app/client

RUN npm run build


FROM nginx:1.16.0-alpine
COPY --from=build /app/client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
