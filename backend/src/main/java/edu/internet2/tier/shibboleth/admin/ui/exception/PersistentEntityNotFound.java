package edu.internet2.tier.shibboleth.admin.ui.exception;

/**
 * Generically meaning - hibernate entity, not SAML entity
 */
public class PersistentEntityNotFound extends Exception {
    public PersistentEntityNotFound(String message) {
        super(message);
    }
}