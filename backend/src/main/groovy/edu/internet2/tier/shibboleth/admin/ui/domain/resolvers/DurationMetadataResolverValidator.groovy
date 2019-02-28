package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import edu.internet2.tier.shibboleth.admin.util.DurationUtility

class DurationMetadataResolverValidator implements MetadataResolverValidator {
    boolean supports(MetadataResolver resolver) {
        return resolver.hasProperty('dynamicMetadataResolverAttributes') || resolver.hasProperty('reloadableMetadataResolverAttributes')
    }

    ValidationResult validate(MetadataResolver resolver) {
        if (resolver.hasProperty('dynamicMetadataResolverAttributes')) {
            DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes = resolver.dynamicMetadataResolverAttributes
            if (dynamicMetadataResolverAttributes != null) {
                if (DurationUtility.toMillis(dynamicMetadataResolverAttributes.minCacheDuration) > DurationUtility.toMillis(dynamicMetadataResolverAttributes.maxCacheDuration)) {
                    return new ValidationResult('minimum cache duration larger than maximum')
                }
            }
        }

        if (resolver.hasProperty('reloadableMetadataResolverAttributes')) {
            ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes = resolver.reloadableMetadataResolverAttributes
            if (reloadableMetadataResolverAttributes != null) {
                if (DurationUtility.toMillis(reloadableMetadataResolverAttributes.minRefreshDelay) > DurationUtility.toMillis(reloadableMetadataResolverAttributes.maxRefreshDelay)) {
                    return new ValidationResult('minimum refresh delay duration larger than maximum')
                }
            }
        }
        return new ValidationResult()
    }
}
