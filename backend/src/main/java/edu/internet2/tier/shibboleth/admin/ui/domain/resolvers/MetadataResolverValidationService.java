package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator.ValidationResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * A facade that aggregates {@link MetadataResolverValidator}s available to call just one of them supporting the type of a given resolver.
 * If no {@link MetadataResolverValidator}s are configured, conciders provided MetadataResolver as valid.
 * <p>
 * Uses chain-of-responsibility design pattern
 *
 * @author Dmitriy Kopylenko
 */
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
