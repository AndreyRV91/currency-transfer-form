FROM node:alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
EXPOSE 5000
COPY . .
CMD ["yarn", "start"]