package edu.internet2.tier.shibboleth.admin.ui;

import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.script.ScriptException;

@SpringBootApplication
@ComponentScan(excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "edu.internet2.tier.shibboleth.admin.ui.configuration.auto.*"))
@EntityScan(basePackages = {"edu.internet2.tier.shibboleth.admin.ui.domain", "edu.internet2.tier.shibboleth.admin.ui.envers", "edu.internet2.tier.shibboleth.admin.ui.security.model"})
@EnableJpaAuditing
@EnableScheduling
@EnableWebSecurity
@EnableAsync
@OpenAPIDefinition(info=@Info(description = "The Shibboleth UI is specifically designed to help manage and edit metadata-driven configuration support for Shibboleth", title = "Shibboleth UI API", version = "1.0"))
public class ShibbolethUiApplication extends SpringBootServletInitializer {

    private static final Logger logger = LoggerFactory.getLogger(ShibbolethUiApplication.class);

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ShibbolethUiApplication.class);
    }

    public static void main(String... args) {
        SpringApplication.run(ShibbolethUiApplication.class, args);
    }

    @Component
    @Profile("dev")
    public static class MetadataResolversResourceIdEmitter {

        @Autowired
        MetadataResolverRepository metadataResolverRepository;

        @EventListener
        public void showMetadataResolversResourceIds(ApplicationStartedEvent e) {
            metadataResolverRepository.findAll()
                    .forEach(it -> logger.info(String.format("MetadataResolver [%s: %s]", it.getName(), it.getResourceId())));
        }
    }

    @Component
    public static class MetadataResolverInitializingApplicationStartupListener {

        @Autowired
        MetadataResolverService metadataResolverService;

        @Autowired
        MetadataResolverRepository metadataResolverRepository;

        @Transactional
        @EventListener
        public void initializeResolvers(ApplicationStartedEvent e) {
            metadataResolverRepository.findAll()
                    .forEach(it -> {
                        logger.info(String.format("Reloading filters for resolver [%s: %s]", it.getName(), it.getResourceId()));
                        try {
                            metadataResolverService.reloadFilters(it.getResourceId());
                        }
                        catch (Throwable ex) {
                            if(ex instanceof ScriptException) {
                                logger.warn("Caught invalid script parsing error. Please fix the script data.", ex);
                                return;
                            }
                            throw ex;
                        }
                    });
        }
    }
}