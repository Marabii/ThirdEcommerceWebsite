FROM node:latest
WORKDIR /server
ADD . .
RUN node generateKeypair.js
RUN npm install
EXPOSE 3000
CMD node app.js