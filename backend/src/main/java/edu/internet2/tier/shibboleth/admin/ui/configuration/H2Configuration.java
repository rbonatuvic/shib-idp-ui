package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.h2.tools.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.sql.SQLException;

/**
 * Inspired by https://techdev.io/en/developer-blog/querying-the-embedded-h2-database-of-a-spring-boot-application
 */
@Configuration
@Profile("dev")
public class H2Configuration {

    @Value("${h2.tcp.port:9092}")
    private String h2TcpPort;

    @Bean
    @ConditionalOnExpression("${h2.tcp.enabled:false}")
    public Server h2TcpServer() throws SQLException {
        return Server.createTcpServer("-tcp", "-tcpAllowOthers", "-tcpPort", h2TcpPort).start();
    }
}
