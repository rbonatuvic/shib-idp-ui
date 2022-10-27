package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.IMetadataResolverValidator.ValidationResult;

import java.util.ArrayList;
import java.util.List;

/**
 * A facade that aggregates {@link IMetadataResolverValidator}s available to call just one of them supporting the type of a given resolver.
 * If no {@link IMetadataResolverValidator}s are configured, considers provided MetadataResolver as valid.
 * <p>
 * Uses chain-of-responsibility design pattern
 *
 * @author Dmitriy Kopylenko
 */
public class MetadataResolverValidationService<T extends MetadataResolver> {

    List<IMetadataResolverValidator<T>> validators;

    public MetadataResolverValidationService(List<IMetadataResolverValidator<T>> validators) {
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