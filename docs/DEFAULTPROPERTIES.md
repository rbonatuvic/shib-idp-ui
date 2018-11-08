# Default properties

This is a reflection of the default `application.properties` file included in the distribution. Note that lines
beginning with `#` are commented out.

Please refer to the Spring Boot documentation [https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html]
for more information.

```properties
# Server Configuration
#server.port=8080

# Logging Configuration
#logging.config=classpath:log4j2.xml

logging.level.org.springframework=INFO
logging.level.edu.internet2.tier.shibboleth.admin.ui=INFO

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

# Liquibase properties
spring.liquibase.enabled=false
#spring.liquibase.change-log=classpath:edu/internet2/tier/shibboleth/admin/ui/database/masterchangelog.xml

# Hibernate properties
# for production never ever use create, create-drop. It's BEST to use validate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming.implicit-strategy=org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

spring.jpa.hibernate.use-new-id-generator-mappings=true

# Set the following property to periodically write out the generated metadata files. There is no default value; the following is just an example
# shibui.metadata-dir=/opt/shibboleth-idp/metadata/generated
shibui.logout-url=/dashboard

# spring.profiles.active=default

#shibui.default-password=

#Actuator endpoints (info)
# Un-comment to get full git details exposed like author, abbreviated SHA-1, commit message
#management.info.git.mode=full

###
# metadata-providers.xml write configuration

# Set the following property to periodically write out metadata providers configuration. There is no default value; the following is just an example
# shibui.metadataProviders.target=file:/opt/shibboleth-idp/conf/shibui-metadata-providers.xml
# shibui.metadataProviders.taskRunRate=30000
```