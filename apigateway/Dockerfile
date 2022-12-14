FROM node:lts

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
EXPOSE 8083

CMD [ "node", "index.js" ]