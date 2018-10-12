# Database configuration

The Shibboleth UI application uses Spring Boot and Spring JPA for database configuration. Out of the box, it ships with
JDBC drivers for H2, MariaDB and Postgres.

By default, it will use an in-memory H2 database. To change which database is used, one should make changes to the
`applications.properties` or `application.yml` file as appropriate. For further information, refer to the appropriate
JDBC driver documentation.

```properties
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
```