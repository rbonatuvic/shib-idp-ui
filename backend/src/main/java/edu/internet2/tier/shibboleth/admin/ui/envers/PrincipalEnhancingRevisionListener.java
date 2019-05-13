package edu.internet2.tier.shibboleth.admin.ui.envers;

import org.hibernate.envers.RevisionListener;

import static edu.internet2.tier.shibboleth.admin.ui.security.springsecurity.PrincipalAccessor.currentPrincipalIfLoggedIn;

/**
 * Implementation of envers revision listener to enhance revision entity with authenticated principal username.
 */
public class PrincipalEnhancingRevisionListener implements RevisionListener {

    private static final String ANONYMOUS = "anonymous";

    @Override
    public void newRevision(Object revisionEntity) {
        PrincipalAwareRevisionEntity rev = (PrincipalAwareRevisionEntity) revisionEntity;
        String user = currentPrincipalIfLoggedIn().orElse(ANONYMOUS);
        rev.setPrincipalUserName(user);
    }
}
