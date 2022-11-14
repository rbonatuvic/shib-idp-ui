package edu.internet2.tier.shibboleth.admin.ui.exception;

public class UnsupportedShibUiOperationException extends Exception {
    public UnsupportedShibUiOperationException() {
        super("Operation unsupport in ShibUI at this time");
    }

    public UnsupportedShibUiOperationException(String message) {
        super(message);
    }
}