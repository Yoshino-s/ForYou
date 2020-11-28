FROM node:14.15.1-alpine

WORKDIR /app

COPY . /app/

RUN yarn --registry https://registry.npm.taobao.org/ --prod

ENTRYPOINT [ "yarn", "start" ]