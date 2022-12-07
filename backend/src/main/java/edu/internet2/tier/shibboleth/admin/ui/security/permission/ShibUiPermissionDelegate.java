package edu.internet2.tier.shibboleth.admin.ui.security.permission;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.IActivatable;
import edu.internet2.tier.shibboleth.admin.ui.domain.IApprovable;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserAccess;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * The ShibUiPermissionDelegate is the default service for SHIBUI, which delegates calls (primarily) to the the UserService to determine
 * whether a user has the correct abilty to act a particular way (possibly on certain objects). Because the Authentication being
 * supplied to this implmentation comes from the user service, we ignore it and defer to the UserService (which is ultimately using
 * the Authentication from the security context anyway).
 *
 */
@AllArgsConstructor
public class ShibUiPermissionDelegate implements IShibUiPermissionEvaluator {
    private DynamicRegistrationInfoRepository dynamicRegistrationInfoRepository;

    private EntityDescriptorRepository entityDescriptorRepository;

    private UserService userService;

    @Override
    public Collection getPersistentEntities(Authentication ignored, ShibUiPermissibleType shibUiType, PermissionType permissionType) throws ForbiddenException {
        switch (shibUiType) {
        case entityDescriptorProjection:
            switch (permissionType) {
            case approve:
                return getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess();
            case enable:
                // This particular list is used for an admin function, so the user must be an ADMIN
                if (!hasPermission(ignored, null, PermissionType.admin)) {
                    throw new ForbiddenException();
                }
                return entityDescriptorRepository.getEntityDescriptorsNeedingEnabling();
            case fetch:
                if (!hasPermission(ignored, null, PermissionType.fetch)) {
                    throw new ForbiddenException("User has no access rights to get a list of : " + shibUiType);
                }
                return getAllEntityDescriptorProjectionsBasedOnUserAccess();
            }
        case dynamicRegistrationInfo:
            switch (permissionType) {
            case approve:
                return getAllDynamicRegistrationInfoObjectsNeedingApprovalBasedOnUserAccess();
            case enable:
                // This particular list is used for an admin function, so the user must be an ADMIN
                if (!hasPermission(ignored, null, PermissionType.admin)) {
                    throw new ForbiddenException();
                }
                return dynamicRegistrationInfoRepository.getDynamicRegistrationsNeedingEnabling();
            case fetch:
                return getAllDynamicRegistrationInfoObjectsBasedOnUserAccess();
            }
        }
        return null;
    }

    private List<DynamicRegistrationInfo> getAllDynamicRegistrationInfoObjectsNeedingApprovalBasedOnUserAccess() {
        List<String> groupsToApprove = userService.getGroupsCurrentUserCanApprove();
        return dynamicRegistrationInfoRepository.getAllNeedingApproval(groupsToApprove);
    }

    private List<DynamicRegistrationInfo> getAllDynamicRegistrationInfoObjectsBasedOnUserAccess() {
        if (userService.currentUserIsAdmin()) {
            return dynamicRegistrationInfoRepository.findAll();
        } else {
            return dynamicRegistrationInfoRepository.findAllByIdOfOwner(userService.getCurrentUser().getGroup().getOwnerId());
        }
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
    public boolean hasPermission(Authentication ignored, Object targetDomainObject, Object permission) {
        switch ((PermissionType) permission) {
        case admin: // we don't care about the object - the user is an admin or not
            return userService.currentUserIsAdmin();
        case approve:
            if (userService.currentUserIsAdmin()) { return true; }
            return targetDomainObject instanceof IApprovable ? userService.getGroupsCurrentUserCanApprove().contains(((IApprovable)targetDomainObject).getIdOfOwner()) : false;
        case enable:
            return targetDomainObject instanceof IActivatable ? currentUserCanEnable((IActivatable) targetDomainObject) : false;
        case fetch: // we don't care about one object, just the user's ability to fetch data
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

    private boolean currentUserCanEnable(IActivatable activatableObject) {
        if (userService.currentUserIsAdmin()) { return true; }
        switch (activatableObject.getActivatableType()) {
        case DYNAMIC_REGISTRATION:
        case ENTITY_DESCRIPTOR: {
            return currentUserHasExpectedRole(Arrays.asList("ROLE_ENABLE" )) && userService.getCurrentUserGroup().getOwnerId().equals(activatableObject.getIdOfOwner());
        }
        // Currently filters and providers dont have ownership, so we just look for the right role
        case FILTER:
        case METADATA_RESOLVER:
            return currentUserHasExpectedRole(Arrays.asList("ROLE_ENABLE" ));
        default:
            return false;
        }
    }

    /**
     * This basic logic assumes users only have a single role (despite users having a list of roles, we assume only 1 currently)
     */
    private boolean currentUserHasExpectedRole(List<String> acceptedRoles) {
        User user = userService.getCurrentUser();
        return acceptedRoles.contains(user.getRole());
    }
}