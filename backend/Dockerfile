FROM gcr.io/distroless/java

ARG JAR_FILE

COPY ${JAR_FILE} app.jar

EXPOSE 8080

CMD ["app.jar"]