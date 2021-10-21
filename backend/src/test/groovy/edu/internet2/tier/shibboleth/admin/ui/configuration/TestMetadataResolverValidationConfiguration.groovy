package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.IMetadataResolverValidator
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.MetadataResolverValidationService
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.ResourceBackedIMetadataResolverValidator
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TestMetadataResolverValidationConfiguration {
    @Bean
    ResourceBackedIMetadataResolverValidator resourceBackedMetadataResolverValidator() {
        new ResourceBackedIMetadataResolverValidator()
    }

    @Bean
    MetadataResolverValidationService metadataResolverValidationServiceEmpty() {
        new MetadataResolverValidationService(null)
    }

    @Bean
    MetadataResolverValidationService metadataResolverValidationService(List<IMetadataResolverValidator> metadataResolverValidators) {
        new MetadataResolverValidationService(metadataResolverValidators)
    }

}