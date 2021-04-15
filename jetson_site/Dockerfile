FROM ubuntu
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /jetson_site
RUN apt-get update
RUN apt -y --force-yes install nodejs npm
RUN npm install npm@latest
RUN npm install --global yarn
COPY . .
RUN ls
RUN cd jetson_site
RUN ls
RUN yarn install
RUN yarn build
CMD ["sh", "enter.sh"]
