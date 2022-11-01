package edu.internet2.tier.shibboleth.admin.ui.security.permission;

import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import java.util.Collection;

public interface IShibUiPermissionEvaluator extends PermissionEvaluator {

    /**
     * Return a Collection of items matching the type describing those types that can be asked for and for which the authenticated
     * user has the correct permission to access
     * @param authentication The security Authorization
     * @param type The permissible type that should be returned in the collection. This is an abstraction
     * @param permissionType The type of permissions the user should have to access the items returned in the collection. Determining
     *                       the relationship is up to the implementation
     * @return Collection of objects representing the type described by the ShibUiPermissibleType enumeration
     * @throws ForbiddenException if the user does not have the correct authority required
     */
    Collection getPersistentEntities(Authentication authentication, ShibUiPermissibleType type, PermissionType permissionType) throws ForbiddenException;
}