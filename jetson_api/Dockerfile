FROM ubuntu
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /jetson_api
RUN apt-get update
#RUN curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
RUN apt -y --force-yes install nodejs && apt install npm
RUN npm install npm@latest
RUN npm install --global yarn
RUN apt-get update && apt-get -y --force-yes install curl
#RUN apt -y --force-yes install wget
COPY ./jetson_api .
RUN yarn start
LABEL arch=arm64
