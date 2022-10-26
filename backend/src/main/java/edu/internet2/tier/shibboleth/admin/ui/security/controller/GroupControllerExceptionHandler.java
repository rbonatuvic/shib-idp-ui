package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@ControllerAdvice(assignableTypes = {GroupController.class})
public class GroupControllerExceptionHandler extends ResponseEntityExceptionHandler {
    
    @ExceptionHandler({ PersistentEntityNotFound.class })
    public ResponseEntity<?> handleEntityNotFoundException(PersistentEntityNotFound e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups").build().toUri());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                        .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()), e.getMessage()));
    }
    
    @ExceptionHandler({ GroupDeleteException.class })
    public ResponseEntity<?> handleForbiddenAccess(GroupDeleteException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups/{resourceId}").build().toUri());

        return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers)
                        .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), e.getMessage()));
    }
    
    @ExceptionHandler({ GroupExistsConflictException.class })
    public ResponseEntity<?> handleGroupExistsConflict(GroupExistsConflictException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups").build().toUri());

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).headers(headers)
                        .body(new ErrorResponse(String.valueOf(HttpStatus.METHOD_NOT_ALLOWED.value()), e.getMessage()));
    }

    @ExceptionHandler({ InvalidGroupRegexException.class })
    public ResponseEntity<?> handleInvalidGroupRegexException(InvalidGroupRegexException e, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups").build().toUri());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).headers(headers)
                        .body(new ErrorResponse(String.valueOf(HttpStatus.BAD_REQUEST.value()), e.getMessage()));
    }

}