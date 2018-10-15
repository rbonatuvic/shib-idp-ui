package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Indicates JSON schema validation failure. Encapsulates a list of error messages produced by JSON schema validator
 * component.
 *
 * @author Dmitriy Kopylenko
 */
@RequiredArgsConstructor
@Getter
public class JsonSchemaValidationFailedException extends RuntimeException {

    private final List<String> errors;

}
