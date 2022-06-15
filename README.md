# shibui

## Requirements_

* Java 11 (note that ONLY Java 11 is supported at this time; other later versions might work)

## Running

There are currently 2 ways to run the application:

1. As an executable WAR using Java
1. deployed in a Java Servlet 3.0 container such as Tomcat or Jetty

Note that some features require encoded slashes in the URL. In tomcat (which is embedded in the war), this can be
allowed with:

```
-Dorg.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH=true
```

In Apache HTTPD, you'll need something like:

```
<VirtualHost *:80>
    AllowEncodedSlashes NoDecode
    ServerName shibui.unicon.net
    ProxyPass / http://localhost:8080/ nocanon
    ProxyPassReverse / http://localhost:8080/
</VirtualHost>
```

### Running as an executable

`java -jar shibui.war`

For complete information on overriding default configuration, see [https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html].

### Deploying as a WAR

The application can be deployed as a WAR file in a Java Servlet 3.0 container.

To override default configuration, see [https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html].
The easiest way to do this in a servlet container is through the use of system properties

## Authentication

Currently, the application is wired with very simple authentication. A password for the user `root`
can be set with the `shibui.default-password` property.

## Default Properties

This is a reflection of the default `application.properties` file included in the distribution. Note that lines
beginning with `#` are commented out.


```
# Server Configuration
#server.port=8080


# Logging Configuration
#logging.config=classpath:log4j2.xml
#logging.level.org.springframework.web=ERROR

# Database Credentials
spring.datasource.username=shibui
spring.datasource.password=shibui

# Database Configuration H2
spring.datasource.url=jdbc:h2:mem:shibui;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.platform=h2
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true


# Database Configuration PostgreSQL
#spring.datasource.url=jdbc:postgresql://localhost:5432/shibui
#spring.datasource.driverClassName=org.postgresql.Driver
#spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

#Maria/MySQL DB
#spring.datasource.url=jdbc:mariadb://localhost:3306/shibui
#spring.datasource.driverClassName=org.mariadb.jdbc.Driver
#spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

#Tomcat specific DataSource props. Do we need these?
#spring.datasource.tomcat.maxActive=100
#spring.datasource.tomcat.minIdle=10
#spring.datasource.tomcat.maxIdle=10
#spring.datasource.tomcat.initialSize=50
#spring.datasource.tomcat.validationQuery=select 1

# Liquibase properties
liquibase.enabled=false
#liquibase.change-log=classpath:edu/internet2/tier/shibboleth/admin/ui/database/masterchangelog.xml

# Hibernate properties
# for production never ever use create, create-drop. It's BEST to use validate
spring.jpa.hibernate.ddl-auto=create
spring.jpa.hibernate.naming.implicit-strategy=org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

spring.jpa.hibernate.use-new-id-generator-mappings=true

shibui.metadata-dir=/opt/shibboleth-idp/metadata/generated
shibui.logout-url=/dashboard

spring.profiles.active=default

# Password for the default user. If not set, a password will be generated at startup
#shibui.default-password=

springdoc.use-management-port=true
springdoc.pathsToMatch=/entities, /api/**
# This property enables the openapi and swagger-ui endpoints to be exposed beneath the actuator base path.
management.endpoints.web.exposure.include=openapi, swagger-ui
management.server.port=9090
```