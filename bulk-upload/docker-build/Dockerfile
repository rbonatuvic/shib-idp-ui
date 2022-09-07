FROM debian:stable-slim
MAINTAINER sporth@unicon.net

RUN  apt-get clean \
     && apt-get -y update \
     && apt-get install -y librest-client-perl libconfig-file-perl jq libxml-libxml-perl libjson-perl

WORKDIR /opt
COPY shibui-md-upload.pl /opt/shibui-md-upload.pl
ENTRYPOINT ["/opt/shibui-md-upload.pl"]
