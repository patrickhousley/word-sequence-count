FROM node:16 as builder

WORKDIR /app

COPY package.json package-lock.json /app
RUN npm ci

COPY tsconfig.json /app
COPY src /app/src
RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY bin /app/bin
RUN chmod +x /app/bin/cli.js

ENTRYPOINT ["node", "/app/bin/cli.js"]
