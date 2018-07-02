FROM node:9
MAINTAINER Éverton Arruda <root@earruda.eti.br>

# Add backports repository to install certbot
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/backports.list
RUN apt-get update -y
RUN apt-get install nginx -y
RUN apt-get install certbot -y -t jessie-backports

EXPOSE 80
EXPOSE 443
EXPOSE 3000

ADD app /opt/app
WORKDIR /opt/app
RUN yarn install

CMD ["yarn", "dev"]
