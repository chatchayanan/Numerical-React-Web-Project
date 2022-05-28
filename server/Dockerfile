FROM node:alpine3.14

WORKDIR /server

COPY package.json /server

RUN npm install

COPY . /server

EXPOSE 4000

CMD [ "npm", "start" ]