FROM node:9
MAINTAINER Éverton Arruda <root@earruda.eti.br>

RUN apt-get update -y && apt-get install nginx -y

EXPOSE 80
EXPOSE 443

ADD app /opt/app
WORKDIR /opt/app
RUN yarn install

CMD ["yarn", "dev"]
