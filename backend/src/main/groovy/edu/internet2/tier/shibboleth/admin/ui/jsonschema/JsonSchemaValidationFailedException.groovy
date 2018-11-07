package edu.internet2.tier.shibboleth.admin.ui.jsonschema

/**
 * Indicates JSON schema validation failure. Encapsulates a list of error messages produced by JSON schema validator
 * component.
 *
 * @author Dmitriy Kopylenko
 */
class JsonSchemaValidationFailedException extends RuntimeException {

    def errors

    JsonSchemaValidationFailedException(List<String> errors) {
        this.errors = errors
    }
}
