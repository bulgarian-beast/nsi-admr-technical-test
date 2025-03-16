# Stage 1: Copile code into binary to avoid include it in final docker
FROM node:18-alpine AS builder

WORKDIR /usr/app/vitalis

COPY package.json package-lock.json ./

RUN npm install -g pkg && npm install

COPY src src

COPY server.js server.js

RUN pkg . --out-path ./dist


# Stage 2: Copy only binary from stage 1 and ensure non-root user is used for security
FROM alpine:3.18

ENV NODE_ENV=production

WORKDIR /usr/app/vitalis

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /usr/app/vitalis/dist/vitalis ./

RUN chmod +x vitalis

USER appuser

CMD ["./vitalis"]