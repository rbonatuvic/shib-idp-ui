package edu.internet2.tier.shibboleth.admin.ui.controller;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import javax.script.ScriptException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import edu.internet2.tier.shibboleth.admin.ui.domain.exceptions.MetadataFileNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InitializationException;

@ControllerAdvice(assignableTypes = {ActivateController.class})
public class ActivateExceptionHandler extends ResponseEntityExceptionHandler {
    
    @ExceptionHandler({ PersistentEntityNotFound.class })
    public ResponseEntity<?> handleEntityNotFoundException(PersistentEntityNotFound e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
    }
    
    @ExceptionHandler({ ForbiddenException.class })
    public ResponseEntity<?> handleForbiddenAccess(ForbiddenException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(String.valueOf(HttpStatus.FORBIDDEN.value()), e.getMessage()));
    }
    
    @ExceptionHandler({ InitializationException.class })
    public ResponseEntity<?> handleInitializationException(InitializationException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()), e.getMessage()));
    }
    
    @ExceptionHandler({ MetadataFileNotFoundException.class })
    public ResponseEntity<?> handleMetadataFileNotFoundException(MetadataFileNotFoundException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(INTERNAL_SERVER_ERROR.toString(), e.getLocalizedMessage()));
    }
    
    @ExceptionHandler({ ScriptException.class })
    public ResponseEntity<?> handleScriptException(ScriptException e, WebRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()), e.getMessage()));
    }
     
    
}