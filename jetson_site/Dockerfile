FROM ubuntu:18.04
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /jetson_site
RUN apt-get update
RUN apt -y --force-yes install nodejs npm
#RUN npm install npm@latest
RUN npm install --global yarn
COPY ./jetson_site .
RUN pwd && ls
RUN yarn install
RUN yarn build
COPY . .
LABEL arch=arm64
CMD ["sh", "enter.sh"]
