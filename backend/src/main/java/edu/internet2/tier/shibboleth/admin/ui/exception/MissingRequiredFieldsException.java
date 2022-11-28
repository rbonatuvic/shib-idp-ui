package edu.internet2.tier.shibboleth.admin.ui.exception;

public class MissingRequiredFieldsException extends Exception {
    public MissingRequiredFieldsException(String entityId) {
        super(entityId);
    }
}