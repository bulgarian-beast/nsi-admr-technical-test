# Stage 1: Copile code into binary to avoid include it in final docker
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install -g pkg && npm install

COPY src src

COPY server.js server.js

RUN pkg . --out-path ./dist


# Stage 2: Copy only binary from stage 1 and ensure non-root user is used for security
FROM alpine:3.18

ARG CONTAINER_INTERNAL_PORT=3000

ENV NODE_ENV=production
ENV CONTAINER_INTERNAL_PORT=${CONTAINER_INTERNAL_PORT}

WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /usr/src/app/dist/dashboard ./

RUN chmod +x dashboard

USER appuser

EXPOSE ${CONTAINER_INTERNAL_PORT}

CMD ["./dashboard"]