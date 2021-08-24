package edu.internet2.tier.shibboleth.admin.ui.exception;

public class ForbiddenException extends Exception {
    public ForbiddenException() {
        super("You are not authorized to perform the requested operation.");
    }
    
    public ForbiddenException(String message) {
        super(message);
    }
}
