package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;

@ControllerAdvice(assignableTypes = {ShibPropertiesController.class})
public class ShibPropertiesControllerExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({ PersistentEntityNotFound.class })
    public ResponseEntity<?> handleEntityNotFoundException(PersistentEntityNotFound e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler({ IOException.class })
    public ResponseEntity<?> handleIOException(IOException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating file");
    }

    @ExceptionHandler({ ObjectIdExistsException.class })
    public ResponseEntity<?> handleObjectIdExistsException(ObjectIdExistsException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(EntityDescriptorController.getResourceUriFor(e.getMessage()));
        return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers).body(new ErrorResponse(
                        String.valueOf(HttpStatus.CONFLICT.value()),
                        String.format("The property set with id [%s] already exists.", e.getMessage())));
    }
}