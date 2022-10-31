package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleExistsConflictException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@ControllerAdvice(assignableTypes = {RolesController.class})
public class RolesExceptionHandler extends ResponseEntityExceptionHandler {
    
    @ExceptionHandler({ PersistentEntityNotFound.class })
    public ResponseEntity<?> handleEntityNotFoundException(PersistentEntityNotFound e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
    }
    
    @ExceptionHandler({ RoleDeleteException.class })
    public ResponseEntity<?> handleForbiddenAccess(RoleDeleteException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/role/{resourceId}").build().toUri());
        return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers)
                        .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), e.getMessage()));

    }
    
    @ExceptionHandler({RoleExistsConflictException.class})
    public ResponseEntity<?> handleRoleExistsConflictException(RoleExistsConflictException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()));
    }
}