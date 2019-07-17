package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.envers.EnversVersionServiceSupport;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService;
import edu.internet2.tier.shibboleth.admin.ui.service.EnversEntityDescriptorVersionService;
import edu.internet2.tier.shibboleth.admin.ui.service.EnversMetadataResolverVersionService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Configuration
public class EntitiesVersioningConfiguration {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public EntityDescriptorVersionService entityDescriptorVersionService(EntityDescriptorService entityDescriptorService) {
        return new EnversEntityDescriptorVersionService(enversVersionServiceSupport(), entityDescriptorService);
    }

    @Bean
    public MetadataResolverVersionService metadataResolverVersionService() {
        return new EnversMetadataResolverVersionService(enversVersionServiceSupport());
    }

    @Bean
    public EnversVersionServiceSupport enversVersionServiceSupport() {
        return new EnversVersionServiceSupport(entityManager);
    }
}
