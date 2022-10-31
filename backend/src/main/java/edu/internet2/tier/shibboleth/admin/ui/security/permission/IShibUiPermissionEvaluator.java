package edu.internet2.tier.shibboleth.admin.ui.security.permission;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import java.util.Collection;
import java.util.Map;

public interface IShibUiPermissionEvaluator extends PermissionEvaluator {
//
//    /**
//     * For a given permission, find all the persistant entities a user has rights to.
//     */
//    Collection getPersistentEntitiesWithPermission(Authentication authentication, Object permission);
//
//    /**
//     * Get ALL persistent entities that user has access to
//     * @param authentication
//     * @return a map. The key value will be the entity tuple and the value portions will be the set of permissions a user has on those objects
//     */
//    Map<IPersistentEntityTuple, Object> getPersistentEntities(Authentication authentication);

    Collection getPersistentEntities(Authentication authentication, ShibUiType type, PermissionType permissionType);
}