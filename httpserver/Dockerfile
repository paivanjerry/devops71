FROM node:lts

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
EXPOSE 8080

CMD [ "node", "index.js" ]