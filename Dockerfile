FROM node:13.3.0-alpine3.10
WORKDIR /usr/src/which-movie
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
