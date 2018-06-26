package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator.ValidationResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class MetadataResolverValidationService<T extends MetadataResolver> {

    private List<MetadataResolverValidator> validators;

    public MetadataResolverValidationService(List<MetadataResolverValidator> validators) {
        this.validators = validators != null ? validators : new ArrayList<>();
    }

    @SuppressWarnings("Uncheked")
    public ValidationResult validateIfNecessary(T metadataResolver) {
        Optional<MetadataResolverValidator> validator =
                this.validators
                        .stream()
                        .filter(v -> v.supports(metadataResolver))
                        .findFirst();
        return validator.isPresent() ? validator.get().validate(metadataResolver) : new ValidationResult(null);

    }
}
