package edu.internet2.tier.shibboleth.admin.ui.controller.support;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.domain.exceptions.MetadataFileNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaValidationFailedException;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

/**
 * Common functionality for REST controllers.
 *
 * @author Dmitriy Kopylenko
 */
@RestControllerAdvice
public class RestControllersSupport {

    @Autowired
    MetadataResolverRepository resolverRepository;

    public MetadataResolver findResolverOrThrowHttp404(String resolverResourceId) {
        MetadataResolver resolver = resolverRepository.findByResourceId(resolverResourceId);
        if(resolver == null) {
            throw new HttpClientErrorException(NOT_FOUND, "Metadata resolver is not found");
        }
        return resolver;
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<?> notFoundHandler(HttpClientErrorException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(new ErrorResponse(ex.getStatusCode().toString(), ex.getStatusText()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseConstraintViolation(ConstraintViolationException ex) {
        return ResponseEntity.status(BAD_REQUEST).body(new ErrorResponse("400", "message.database-constraint"));
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ErrorResponse> handleAllOtherExceptions(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse("400", ex.getLocalizedMessage(), ex.getCause() == null ? null : ex.getCause().getLocalizedMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MetadataFileNotFoundException.class)
    public final ResponseEntity<ErrorResponse> metadataFileNotFoundHandler(MetadataFileNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(INTERNAL_SERVER_ERROR.toString(), ex.getLocalizedMessage());
        return new ResponseEntity<>(errorResponse, INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(JsonSchemaValidationFailedException.class)
    public final ResponseEntity<?> handleJsonSchemaValidationFailedException(JsonSchemaValidationFailedException ex) {
        return ResponseEntity.status(BAD_REQUEST).body(new ErrorResponse("400", String.join("\n", ex.getErrors())));
    }
}
