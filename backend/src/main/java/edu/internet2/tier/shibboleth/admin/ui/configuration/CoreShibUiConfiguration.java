package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.EntityDescriptorFilesScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchService;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl;
import net.andreinc.mockneat.MockNeat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

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

    @Bean
    public EntityIdsSearchService entityIdsSearchService() {
        //TODO: replace with real data store implementation when ready
        return (term, limit) -> {
            MockNeat m = MockNeat.threadLocal();
            // Just simulate returning 100 results for no-limit query
            List<String> simulatedEntityIds = limit > 0 ? m.urls().list(limit).val() : m.urls().list(100).val();
            return new EntityIdsSearchResultRepresentation(simulatedEntityIds);
        };
    }
}
