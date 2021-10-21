package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver;

public class ResourceBackedIMetadataResolverValidator implements IMetadataResolverValidator<ResourceBackedMetadataResolver> {

    @Override
    public boolean supports(MetadataResolver resolver) {
        return resolver instanceof ResourceBackedMetadataResolver;
    }

    @Override
    public ValidationResult validate(ResourceBackedMetadataResolver resolver) {
        try {
            resolver.validateAndDetermineResourceType();
        }
        catch (ResourceBackedMetadataResolver.InvalidResourceTypeException e) {
            return new ValidationResult(e.getMessage());
        }
        return new ValidationResult();
    }
}