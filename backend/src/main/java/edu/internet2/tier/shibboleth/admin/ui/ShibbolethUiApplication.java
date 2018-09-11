package edu.internet2.tier.shibboleth.admin.ui;

import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.TokenPlaceholderValueResolvingService;
import edu.internet2.tier.shibboleth.admin.util.TokenPlaceholderResolvers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.PropertyResolver;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

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

    @Component
    @Profile("dev")
    public static class MetadataResolversResourceIdEmitter {

        @Autowired
        MetadataResolverRepository metadataResolverRepository;

        @Value("${idp.home}")
        String idpHome;

        @Autowired
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer;

        @Autowired
        PropertyResolver propertyResolver;

        @EventListener
        void showMetadataResolversResourceIds(ApplicationStartedEvent e) {
            metadataResolverRepository.findAll()
                    .forEach(it -> System.out.println(String.format("MetadataResolver [%s: %s]", it.getName(), it.getResourceId())));

            System.out.println("IDP HOME: " + idpHome);
            String rawValue = "%{idp.home}/metadata/file.xml";
            String resolved = propertyResolver.resolvePlaceholders(rawValue.replace("%{", "${"));
            TokenPlaceholderValueResolvingService service = TokenPlaceholderResolvers.placeholderResolverService();
        }
    }

}
