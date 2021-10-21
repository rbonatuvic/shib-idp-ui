package edu.internet2.tier.shibboleth.admin.ui.exception;

public class ObjectIdExistsException extends Exception {
    public ObjectIdExistsException(String entityId) {
        super(entityId);
    }

}