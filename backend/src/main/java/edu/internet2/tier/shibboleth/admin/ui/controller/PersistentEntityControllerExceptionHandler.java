package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidPatternMatchException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ConcurrentModificationException;

@ControllerAdvice(assignableTypes = {EntityDescriptorController.class, DynamicRegistrationController.class})
public class PersistentEntityControllerExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({ ConcurrentModificationException.class })
    public ResponseEntity<?> handleConcurrentModificationException(ConcurrentModificationException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()));
    }

    @ExceptionHandler({ PersistentEntityNotFound.class })
    public ResponseEntity<?> handleEntityNotFoundException(PersistentEntityNotFound e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
    }
    
    @ExceptionHandler({ ForbiddenException.class })
    public ResponseEntity<?> handleForbiddenAccess(ForbiddenException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN, e.getMessage()));
    }

    @ExceptionHandler({ InvalidPatternMatchException.class })
    public ResponseEntity<?> handleInvalidUrlMatchException(InvalidPatternMatchException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler({ ObjectIdExistsException.class })
    public ResponseEntity<?> handleObjectIdExistsException(ObjectIdExistsException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(EntityDescriptorController.getResourceUriFor(e.getMessage()));
        return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers).body(new ErrorResponse(
                        String.valueOf(HttpStatus.CONFLICT.value()),
                        String.format("The persistent entity with id [%s] already exists.", e.getMessage())));

    }
}