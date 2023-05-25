FROM node:18.16-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV CHAT_API_KEY=

CMD ["yarn", "dev"]
