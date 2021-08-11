package edu.internet2.tier.shibboleth.admin.ui.exception;

public class EntityIdExistsException extends Exception {
    public EntityIdExistsException(String entityId) {
        super(entityId);
    }

}
