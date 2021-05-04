package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import lombok.Getter;

import java.util.List;

/**
 * Indicates JSON schema validation failure. Encapsulates a list of error messages produced by JSON schema validator
 * component.
 *
 * @author Dmitriy Kopylenko
 */
@Getter
public class JsonSchemaValidationFailedException extends RuntimeException {

    List errors;

    JsonSchemaValidationFailedException(List<?> errors) {
        this.errors = errors;
    }
}
