FROM gcr.io/distroless/java

ARG JAR_FILE

COPY loader.properties loader.properties
COPY ${JAR_FILE} app.war

EXPOSE 8080

ENTRYPOINT ["/usr/bin/java", "-jar", "app.war"]
