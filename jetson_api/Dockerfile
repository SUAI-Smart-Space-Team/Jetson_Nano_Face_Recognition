FROM ubuntu
WORKDIR /jetson_api
RUN apt-get update
RUN apt install npm
RUN npm install npm@latest
RUN yarn install
COPY . .
CMD ["yarn", "start"]
