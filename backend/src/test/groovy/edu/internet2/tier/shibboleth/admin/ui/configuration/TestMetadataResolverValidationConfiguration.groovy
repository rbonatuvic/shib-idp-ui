package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidationService
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolverValidator

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class TestMetadataResolverValidationConfiguration {

    @Bean
    ResourceBackedMetadataResolverValidator resourceBackedMetadataResolverValidator() {
        new ResourceBackedMetadataResolverValidator()
    }

    @Bean
    MetadataResolverValidationService metadataResolverValidationServiceEmpty() {
        new MetadataResolverValidationService(null)
    }

    @Bean
    MetadataResolverValidationService metadataResolverValidationServiceOneValidator(List<MetadataResolverValidator> metadataResolverValidators) {
        new MetadataResolverValidationService(metadataResolverValidators)
    }

}
