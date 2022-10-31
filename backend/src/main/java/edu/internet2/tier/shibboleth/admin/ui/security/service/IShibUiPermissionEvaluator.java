package edu.internet2.tier.shibboleth.admin.ui.security.service;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import java.util.Collection;
import java.util.Map;

public interface IShibUiPermissionEvaluator extends PermissionEvaluator {

    Collection getPersistentEntitiesWithPermission(Authentication authentication, Object permission);

    /**
     * Get ALL persistent entities that user has access to
     * @param authentication
     * @return
     */
    Map<IPersistentEntityTuple, Object> getPersistentEntities(Authentication authentication);

    Map<IPersistentEntityTuple, Object> getPersistentEntities(Authentication authentication, Class clazz);

}
