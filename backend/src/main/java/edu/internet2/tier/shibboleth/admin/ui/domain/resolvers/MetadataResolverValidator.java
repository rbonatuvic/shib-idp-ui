package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

public interface MetadataResolverValidator<T extends MetadataResolver> {

    boolean supports(T resolver);

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
