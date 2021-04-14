FROM ubuntu
WORKDIR /jetson_api
RUN sudo apt-get update
RUN sudo npm install npm@latest
RUN yarn install
COPY . .
CMD ["yarn", "start"]
