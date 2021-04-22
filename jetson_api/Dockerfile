FROM ubuntu
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /jetson_a
RUN apt-get update
RUN apt -y --force-yes install nodejs npm
RUN npm install npm@latest
RUN npm install --global yarn
RUN npm install fs
RUN apt-get update && apt-get -y --force-yes install curl
COPY ./jetson_api .
RUN yarn install
RUN mkdir jetson_tmp
COPY ./jetson_tmp /jetson_a/jetson_tmp
CMD ["sh", "enter.sh"]
LABEL arch=arm64
