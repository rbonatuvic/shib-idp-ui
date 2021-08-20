package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.DynamicHttpMetadataResolverValidator
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.MetadataResolverValidationService
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.FileBackedHttpMetadataResolverValidator
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.IMetadataResolverValidator
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.ResourceBackedIMetadataResolverValidator
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile


@Configuration
class TestMetadataResolverValidationConfiguration {

    @Bean
    @Profile("dh-test")
    DynamicHttpMetadataResolverValidator dynamicHttpMetadataResolverValidator(IGroupService groupService, UserService userService) {
        new DynamicHttpMetadataResolverValidator(groupService, userService)
    }

    @Bean
    @Profile("fbh-test")
    FileBackedHttpMetadataResolverValidator fileBackedHttpMetadataResolverValidator(IGroupService groupService, UserService userService) {
        new FileBackedHttpMetadataResolverValidator(groupService, userService)
    }

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