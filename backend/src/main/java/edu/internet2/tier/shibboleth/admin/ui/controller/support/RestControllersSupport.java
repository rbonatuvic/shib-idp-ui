package edu.internet2.tier.shibboleth.admin.ui.controller.support;

import com.google.common.collect.ImmutableMap;
import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
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


    @ExceptionHandler
    public ResponseEntity<?> notFoundHandler(HttpClientErrorException ex) {
        if(ex.getStatusCode() == NOT_FOUND) {
            return ResponseEntity.status(NOT_FOUND).body(ex.getStatusText());
        }
        throw ex;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseConstraintViolation(ConstraintViolationException ex) {
        return ResponseEntity.status(BAD_REQUEST).body(new ErrorResponse("400", "message.database-constraint"));
    }
}
