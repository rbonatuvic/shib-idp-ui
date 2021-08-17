package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.*;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class MetadataResolverValidationConfiguration {

    @Bean ResourceBackedIMetadataResolverValidator resourceBackedMetadataResolverValidator() {
        return new ResourceBackedIMetadataResolverValidator();
    }

    @Bean DynamicHttpMetadataResolverValidator dynamicHttpMetadataResolverValidator(IGroupService groupService, UserService userService) {
        return new DynamicHttpMetadataResolverValidator(groupService, userService);
    }

    @Bean
    FileBackedHttpMetadataResolverValidator fileBackedHttpMetadataResolverValidator(IGroupService groupService, UserService userService) {
        return new FileBackedHttpMetadataResolverValidator(groupService, userService);
    }

    @Bean
    @SuppressWarnings("Unchecked")
    MetadataResolverValidationService metadataResolverValidationService(List<IMetadataResolverValidator> IMetadataResolverValidators) {
        return new MetadataResolverValidationService(IMetadataResolverValidators);
    }

    @Bean DurationIMetadataResolverValidator durationMetadataResolverValidator() {
        return new DurationIMetadataResolverValidator();
    }
}