package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DurationMetadataResolverValidator;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidationService;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolverValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class MetadataResolverValidationConfiguration {

    @Bean
    ResourceBackedMetadataResolverValidator resourceBackedMetadataResolverValidator() {
        return new ResourceBackedMetadataResolverValidator();
    }

    @Bean
    @SuppressWarnings("Unchecked")
    MetadataResolverValidationService metadataResolverValidationService(List<MetadataResolverValidator> metadataResolverValidators) {
        return new MetadataResolverValidationService(metadataResolverValidators);
    }

    @Bean
    DurationMetadataResolverValidator durationMetadataResolverValidator() {
        return new DurationMetadataResolverValidator();
    }
}
