FROM ubuntu:18.04
MAINTAINER docker@unicon.net

RUN  apt-get clean \
     && apt-get -y update \
     && apt-get install -y curl nano vim java-common python-minimal

RUN curl -L0 https://corretto.aws/downloads/latest/amazon-corretto-11-x64-linux-jdk.deb --output corretto11.deb

RUN dpkg --install corretto11.deb \
    && rm -f corretto11.deb

COPY includes/ /

CMD ["/bin/bash", "/runProject.sh"]