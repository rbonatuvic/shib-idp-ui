package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService;
import edu.internet2.tier.shibboleth.admin.ui.service.EnversEntityDescriptorVersionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Configuration
public class EntitiesVersioningConfiguration {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    EntityDescriptorVersionService entityDescriptorVersionService() {
        return new EnversEntityDescriptorVersionService(entityManager);
    }
}
