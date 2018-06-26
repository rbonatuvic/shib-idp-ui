package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

public class ResourceBackedMetadataResolverValidator implements MetadataResolverValidator<ResourceBackedMetadataResolver> {

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
        return new ValidationResult(null);
    }
}
