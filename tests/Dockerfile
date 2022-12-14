FROM node:lts

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
ENV TESTMODE=0
CMD npm run test