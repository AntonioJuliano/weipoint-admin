FROM node:7.10.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git

RUN mkdir -p /home/weipoint/app
WORKDIR /home/weipoint/app

COPY package.json /home/weipoint/app/package.json
RUN npm run prod_install

COPY ./server /home/weipoint/app/server

EXPOSE 3004

RUN adduser -S weipoint
USER weipoint

CMD ["npm","run","prod"]
