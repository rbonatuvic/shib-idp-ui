FROM gcr.io/distroless/java

ARG JAR_FILE

COPY ${JAR_FILE} app.jar
COPY loader.properties loader.properties

EXPOSE 8080

ENTRYPOINT ["/usr/bin/java", "-jar", "app.jar"]
