package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator.ValidationResult;

import java.util.ArrayList;
import java.util.List;

/**
 * A facade that aggregates {@link MetadataResolverValidator}s available to call just one of them supporting the type of a given resolver.
 * If no {@link MetadataResolverValidator}s are configured, considers provided MetadataResolver as valid.
 * <p>
 * Uses chain-of-responsibility design pattern
 *
 * @author Dmitriy Kopylenko
 */
public class MetadataResolverValidationService<T extends MetadataResolver> {

    private List<MetadataResolverValidator<T>> validators;

    public MetadataResolverValidationService(List<MetadataResolverValidator<T>> validators) {
        this.validators = validators != null ? validators : new ArrayList<>();
    }

    @SuppressWarnings("Unchecked")
    public ValidationResult validateIfNecessary(T metadataResolver) {
        // TODO: make this more streamsish
        ValidationResult validationResult = new ValidationResult();
        this.validators
                .stream()
                .filter(v -> v.supports(metadataResolver))
                .forEach(v -> v.validate(metadataResolver).getErrorMessages().stream().filter(m -> m != null).forEach(r -> validationResult.getErrorMessages().add(r)));
        return validationResult;
    }

    //Package-private - used for unit tests
    boolean noValidatorsConfigured() {
        return this.validators.size() == 0;
    }
}
