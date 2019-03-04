package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import java.util.ArrayList;
import java.util.List;

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

        public ValidationResult() {}

        public ValidationResult(String errorMessage) {
            if (errorMessage != null) {
                this.errorMessages.add(errorMessage);
            }
        }

        private List<String> errorMessages = new ArrayList<>();

        public List<String> getErrorMessages() {
            return errorMessages;
        }

        public boolean isValid() {
            return this.errorMessages == null || this.errorMessages.isEmpty();
        }
    }
}
