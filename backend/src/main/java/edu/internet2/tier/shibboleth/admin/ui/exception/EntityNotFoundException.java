package edu.internet2.tier.shibboleth.admin.ui.exception;

/**
 * Generically meaning - hibernate entity, not SAML entity
 */
public class EntityNotFoundException extends Exception {
    public EntityNotFoundException(String message) {
        super(message);
    }
}