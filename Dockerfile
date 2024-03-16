FROM --platform=$BUILDPLATFORM node:21-alpine as builder

RUN apk add make g++ alpine-sdk python3 py3-pip
RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install

COPY . .
RUN pnpm build
RUN pnpm build:rollup
RUN pnpm bundle


FROM --platform=$BUILDPLATFORM alpine:3.19 as runner

RUN apk add --no-cache libstdc++

WORKDIR /app

COPY --from=builder /app/dist/raycast-unblock-app .

ENV TZ=Asia/Shanghai

EXPOSE 3000

# CMD ["node", "index.js"]
ENTRYPOINT ["./raycast-unblock-app"]