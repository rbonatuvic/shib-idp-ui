package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice(assignableTypes = {AttributeBundleController.class})
public class AttributeBundleExceptionHandler {
    @ExceptionHandler({ ObjectIdExistsException.class })
    public ResponseEntity<?> handleObjectIdExistsException(ObjectIdExistsException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(EntityDescriptorController.getResourceUriFor(e.getMessage()));
        return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers).body(new ErrorResponse(
                        String.valueOf(HttpStatus.CONFLICT.value()),
                        String.format("The attribute bundle with resource id [%s] already exists.", e.getMessage())));

    }
}