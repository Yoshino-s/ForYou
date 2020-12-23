FROM node:14.15.1-alpine as build-front

WORKDIR /app

COPY front /app

RUN yarn config set registry https://registry.npm.taobao.org/ \
 && yarn && yarn build

FROM node:14.15.1-alpine as build-back

WORKDIR /app

COPY back /app

RUN yarn config set registry https://registry.npm.taobao.org/ \
 && yarn && yarn build

FROM node:14.15.1-alpine as runtime

WORKDIR /app

COPY --from=build-front /app/dist /app/static
COPY --from=build-back /app/dist /app/dist
COPY --from=build-back /app/package.json  /app/

RUN yarn config set registry https://registry.npm.taobao.org/ \
 && yarn install --prod

RUN ls /app

ENTRYPOINT [ "yarn", "start" ]