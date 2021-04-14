FROM ubuntu
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /jetson_api
RUN apt-get update
RUN apt -y --force-yes install nodejs npm
RUN npm install npm@latest
RUN npm install --global yarn
RUN apt-get update && apt-get -y --force-yes install curl
RUN apt-get install php5-curl
COPY ./jetson_api .
CMD ["yarn", "start"]
