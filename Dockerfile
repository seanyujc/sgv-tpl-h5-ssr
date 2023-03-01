FROM node:12.22.1-alpine as builder

ARG DEPLOY_ENV=DEV

ENV DEPLOY_ENV=${DEPLOY_ENV}
ENV PORT=80
ENV PUBLIC_PATH=/

WORKDIR /app

COPY . .

RUN npm i -g cross-env rimraf mkdirp ncp
RUN npm install

RUN _DEPLOY_ENV=`echo ${DEPLOY_ENV} | tr [:lower:] [:upper:]`; sed -i "s#runtimes: \".*,#runtimes: \"$_DEPLOY_ENV\",#g" ./public/site.config.js
RUN sed -i "s#port: .*,#port: ${PORT},#g" ./public/site.config.js
RUN cat ./public/site.config.js

RUN npm run build

FROM node:12.22.1-alpine

ENV TZ Asia/Shanghai

WORKDIR /data/app
EXPOSE $PORT

COPY --from=builder /app/dist .

RUN npm i --production

CMD npm run dockerstart

