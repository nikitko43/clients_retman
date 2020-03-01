FROM python:3.7.2


USER root

RUN mkdir /usr/src/app

ENV DB_NAME gym
ENV DB_HOST db
ENV DB_PORT 5432
ENV DB_USER gym
ENV DB_PASSWORD retman
EXPOSE 8000


WORKDIR /usr/src/app

RUN apt-get update

RUN pip3 install --upgrade pip && pip3 install virtualenv

RUN ulimit -n 1000 && apt-get update && apt-get install -y gettext libgettextpo-dev

RUN apt-get install -y postgresql-contrib

COPY ./ $APP_HOME

RUN chmod 777 -R /var/log/postgresql && chmod 777 -R /var/run/postgresql && chmod 777 -R $APP_HOME && chmod 777 -R /usr/local

RUN ulimit -n 1000 && pip install --default-timeout=200 -r $APP_HOME/requirements.txt

RUN ulimit -n 1000 && curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN ulimit -n 1000 \
  && apt-get install -qqy \
       nodejs \
       postgresql-client \
       libxmlsec1-dev \
       unzip \
       fontforge \
       python-lxml \
  && npm install

RUN pip install gunicorn==19.7.1
RUN mkdir /usr/src/app/static
