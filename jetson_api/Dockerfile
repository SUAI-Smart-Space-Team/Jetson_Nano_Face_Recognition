FROM ubuntu
WORKDIR /jetson_api
RUN apt-get update
RUN apt -y --force-yes install nodejs npm
RUN npm install npm@latest
RUN yarn install
COPY . .
CMD ["yarn", "start"]
