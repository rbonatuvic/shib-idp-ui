package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

/**
 * An SPI to validate different types of {@link MetadataResolver}s.
 * <p>
 * Typical usage is - multiple validators for concrete type of resolvers are configured in Spring Application Context,
 * aggregated by {@link MetadataResolverValidationService} facade and then that facade is injected into upstream consumers of it
 * such as REST controllers, etc.
 *
 * @author Dmitriy Kopylenko
 */
public interface MetadataResolverValidator<T extends MetadataResolver> {

    boolean supports(MetadataResolver resolver);

    ValidationResult validate(T resolver);

    class ValidationResult {

        public ValidationResult(String errorMessage) {
            this.errorMessage = errorMessage;
        }

        private String errorMessage;

        public String getErrorMessage() {
            return errorMessage;
        }

        public boolean isValid() {
            return this.errorMessage == null;
        }
    }
}
