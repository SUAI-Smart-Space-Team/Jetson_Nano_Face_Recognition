FROM ubuntu
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /jetson_site
RUN apt-get update
RUN apt -y --force-yes install nodejs npm
RUN npm install npm@latest
RUN npm install --global yarn
RUN yarn build
COPY . .
CMD ["yarn", "start -H 127.0.0.1"]
