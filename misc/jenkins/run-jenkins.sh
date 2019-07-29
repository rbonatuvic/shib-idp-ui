#!/bin/sh

docker run -u root -d --restart always -p 9009:9009 -p 50000:50000 --env JAVA_OPTS=-Xmx2048m -v jenkins-data:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock --name "jenkins" shibui/jenkins  --httpPort=9009 --prefix=/jenkins