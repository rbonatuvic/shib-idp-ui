package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.EntityDescriptorFilesScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoreShibUiConfiguration {

    @Value("${shibui.metadata-dir:/opt/shibboleth-idp/metadata/generated}")
    private String metadataDir;

    @Bean
    public OpenSamlObjects openSamlObjects() {
        return new OpenSamlObjects();
    }

    @Bean
    public EntityDescriptorService jpaEntityDescriptorService() {
        return new JPAEntityDescriptorServiceImpl(openSamlObjects());
    }


    @Bean
    public EntityDescriptorFilesScheduledTasks entityDescriptorFilesScheduledTasks(EntityDescriptorRepository entityDescriptorRepository) {
        return new EntityDescriptorFilesScheduledTasks(this.metadataDir, entityDescriptorRepository, openSamlObjects());
    }
}
