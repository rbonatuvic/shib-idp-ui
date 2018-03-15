package edu.internet2.tier.shibboleth.admin.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = "edu.internet2.tier.shibboleth.admin.ui.domain")
@EnableJpaAuditing
@EnableScheduling
public class ShibbolethUiApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ShibbolethUiApplication.class);
    }

    public static void main(String... args) {
        SpringApplication.run(ShibbolethUiApplication.class, args);
    }

}
