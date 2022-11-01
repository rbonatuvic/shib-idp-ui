package edu.internet2.tier.shibboleth.admin.ui.security.permission;

import edu.internet2.tier.shibboleth.admin.ui.domain.IActivatable;
import edu.internet2.tier.shibboleth.admin.ui.domain.IApprovable;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserAccess;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

/**
 * The ShibUiPermissionDelegate is the default service for SHIBUI, which delegates calls (primarily) to the the userService to determine
 * whether a user has the correct abilty to act a particular way (possibly on certain objects).
 */
@AllArgsConstructor
public class ShibUiPermissionDelegate implements IShibUiPermissionEvaluator {
    private EntityDescriptorRepository entityDescriptorRepository;

    private UserService userService;

    @Override
    public Collection getPersistentEntities(Authentication authentication, ShibUiPermissibleType shibUiType, PermissionType permissionType) throws ForbiddenException {
        switch (shibUiType) {
        case entityDescriptorProjection:
            switch (permissionType) {
            case approver:
                return getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess();
            case enable:
                // This particular list is used for an admin function, so the user must be an ADMIN
                if (!hasPermission(authentication, null, PermissionType.admin)) {
                    throw new ForbiddenException();
                }
                return entityDescriptorRepository.getEntityDescriptorsNeedingEnabling();
            case fetch:
                if (!hasPermission(authentication, null, PermissionType.fetch)) {
                    throw new ForbiddenException("User has no access rights to get a list of Metadata Sources");
                }
                return getAllEntityDescriptorProjectionsBasedOnUserAccess();
            }
        }
        return null;
    }

    private List<EntityDescriptorProjection> getAllEntityDescriptorProjectionsBasedOnUserAccess() {
        if (userService.currentUserIsAdmin()) {
            return entityDescriptorRepository.findAllReturnProjections();
        } else {
            return entityDescriptorRepository.findAllByIdOfOwner(userService.getCurrentUser().getGroup().getOwnerId());
        }
    }

    private List<EntityDescriptorProjection> getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess() {
        List<String> groupsToApprove = userService.getGroupsCurrentUserCanApprove();
        List<EntityDescriptorProjection> result = entityDescriptorRepository.getEntityDescriptorsNeedingApproval(groupsToApprove);
        return result;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        switch ((PermissionType) permission) {
        case admin: // we don't care about the object - the user is an admin or not
            return userService.currentUserIsAdmin();
        case approver:
            if (userService.currentUserIsAdmin()) { return true; }
            return targetDomainObject instanceof IApprovable ? userService.getGroupsCurrentUserCanApprove().contains(((IApprovable)targetDomainObject).getIdOfOwner()) : false;
        case enable:
            return targetDomainObject instanceof IActivatable ? userService.currentUserCanEnable((IActivatable) targetDomainObject) : false;
        case fetch:
            return userService.currentUserIsAdmin() || userService.getCurrentUserAccess().equals(UserAccess.GROUP);
        case viewOrEdit:
            return userService.canViewOrEditTarget((Ownable) targetDomainObject);
        default: return false;
        }
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String target, Object permission) {
        return false; // Unused and Unimplemented - we don't need for this implementation to lookup objects
    }
}