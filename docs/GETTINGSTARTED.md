# Getting Started

## Requirements

* Java 8 (note that ONLY Java 8 is supported at this time)

## Running

There are currently 2 ways to run the application:

1. As an executable
1. deployed in a Java Servlet 3.0 container

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

Note the `AllowEncodedSlashes NoDecode`.

### Running as an executable

`java -jar shibui.war`

For complete information on overriding default configuration, see [https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html].

### Deploying as a WAR

The application can be deployed as a WAR file in a Java Servlet 3.0 container. Currently, the application must be run in the root context.

To override default configuration, see [https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html].
The easiest way to do this in a servlet container is through the use of system properties

## Authentication

Currently, the application is wired with very simple authentication. A password for the user `user`
can be set with the `shibui.default-password` property. If none is set, a default password
will be generated and logged:

```
Using default security password: a3d9ab96-9c63-414f-b199-26fcf59e1ffa
```