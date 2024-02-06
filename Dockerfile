FROM node:21-alpine as builder

WORKDIR /app

COPY . .
RUN apk add make g++ alpine-sdk python3 py3-pip
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build
RUN pnpm build:rollup
# RUN pnpm bundle


FROM node:21-alpine as runner

# RUN apk add zip unzip mongodb-tools rsync

WORKDIR /app

# COPY --from=builder /app/dist/raycast-unblock-app .
COPY --form=builder /app/dist/index.js .

ENV TZ=Asia/Shanghai

EXPOSE 3000

CMD ["node", "index.js"]