package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Owner;
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnerType;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.IShibUiPermissionEvaluator;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.PermissionType;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.ShibUiPermissibleType;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ConcurrentModificationException;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
@NoArgsConstructor
public class JPADynamicRegistrationServiceImpl implements DynamicRegistrationService {
    @Autowired
    IGroupService groupService;

    @Autowired
    DynamicRegistrationInfoRepository repository;

    @Autowired
    OwnershipRepository ownershipRepository;

    @Autowired
    private IShibUiPermissionEvaluator shibUiAuthorizationDelegate;

    @Autowired
    UserService userService;

    @Override
    public DynamicRegistrationRepresentation createNew(DynamicRegistrationRepresentation dynRegRepresentation) throws ObjectIdExistsException {
        if (entityExists(dynRegRepresentation.getResourceId())) {
            throw new ObjectIdExistsException(dynRegRepresentation.getResourceId());
        }

        DynamicRegistrationInfo dri = dynRegRepresentation.buildDynamicRegistrationInfo();
        dri.setEnabled(false); // cannot create as enabled

        // "Create new" will use the current user's group as the owner
        String ownerId = userService.getCurrentUserGroup().getOwnerId();
        dri.setIdOfOwner(ownerId);

        if (shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), null, PermissionType.admin) ||
                        userService.getCurrentUserGroup().getApproversList().isEmpty()) {
            dri.setApproved(true);
        }

        ownershipRepository.deleteEntriesForOwnedObject(dri);
        ownershipRepository.save(new Ownership(userService.getCurrentUserGroup(), dri));

        return new DynamicRegistrationRepresentation(repository.save(dri));
    }

    @Override
    public void delete(String resourceId) throws ForbiddenException, PersistentEntityNotFound {
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), null, PermissionType.admin)) {
            throw new ForbiddenException("Deleting a Dynamic Registration Source is only allowed by an admin.");
        }

        DynamicRegistrationInfo ed = repository.findByResourceId(resourceId);
        if (ed==null) {
            throw new PersistentEntityNotFound("Dynamic Registration not found for resource id: " + resourceId);
        }
        if (ed.isEnabled()) {
            throw new ForbiddenException("Deleting an enabled Dynamic Registration Source is not allowed.");
        }
        ownershipRepository.deleteEntriesForOwnedObject(ed);
        repository.delete(ed);
    }

    private boolean entityExists(String id) {
        return repository.findByResourceId(id) != null ;
    }

    @Override
    public List<DynamicRegistrationInfo> getAllDynamicRegistrationsBasedOnUserAccess() throws ForbiddenException {
        return (List<DynamicRegistrationInfo>) shibUiAuthorizationDelegate.getPersistentEntities(userService.getCurrentUserAuthentication(), ShibUiPermissibleType.dynamicRegistrationInfo, PermissionType.fetch);
    }

    @Override
    public DynamicRegistrationRepresentation update(DynamicRegistrationRepresentation dynRegRepresentation)
                    throws PersistentEntityNotFound, ForbiddenException, ConcurrentModificationException {
        DynamicRegistrationInfo existingDri = repository.findByResourceId(dynRegRepresentation.getResourceId());
        if (existingDri == null) {
            throw new PersistentEntityNotFound(String.format("The dynamic registration with entity id [%s] was not found for update.", existingDri.getResourceId()));
        }
        if (dynRegRepresentation.isEnabled() && !shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), existingDri, PermissionType.enable)) {
            throw new ForbiddenException("You do not have the permissions necessary to enable this service.");
        }
        if (StringUtils.isEmpty(dynRegRepresentation.getIdOfOwner())) {
            dynRegRepresentation.setIdOfOwner(StringUtils.isNotEmpty(existingDri.getIdOfOwner()) ? existingDri.getIdOfOwner() :  userService.getCurrentUserGroup().getOwnerId());
        }
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), existingDri, PermissionType.viewOrEdit)) {
            throw new ForbiddenException();
        }
        // Verify we're the only one attempting to update the EntityDescriptor
        if (dynRegRepresentation.getVersion() != existingDri.hashCode()) {
            throw new ConcurrentModificationException(String.format("A concurrent modification has occured on entity descriptor with entity id [%s]. Please refresh and try again", dynRegRepresentation.getResourceId()));
        }
        existingDri = dynRegRepresentation.updateExistingWithRepValues(existingDri);

        existingDri = repository.save(existingDri);
        ownershipRepository.deleteEntriesForOwnedObject(existingDri);
        ownershipRepository.save(new Ownership(new Owner() {
            public String getOwnerId() { return dynRegRepresentation.getIdOfOwner(); }
            public OwnerType getOwnerType() { return OwnerType.GROUP; }
        }, existingDri));
        return new DynamicRegistrationRepresentation(existingDri);
    }

    @Override
    public DynamicRegistrationRepresentation updateGroupForDynamicRegistration(String resourceId, String groupId) throws ForbiddenException, PersistentEntityNotFound {
        DynamicRegistrationInfo existingDri = repository.findByResourceId(resourceId);
        if (existingDri == null) {
            throw new PersistentEntityNotFound(String.format("The dynamic registration with entity id [%s] was not found for update.", existingDri.getResourceId()));
        }
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), existingDri, PermissionType.admin)) {
            throw new ForbiddenException("You do not have the permissions necessary to change the group for this service.");
        }
        existingDri.setIdOfOwner(groupId);

        Group group = groupService.find(groupId);
        ownershipRepository.deleteEntriesForOwnedObject(existingDri);
        ownershipRepository.save(new Ownership(group, existingDri));
        // check and see if we need to update the approved status
        if (!existingDri.isEnabled()) {
            int numApprovers = group.getApproversList().size();
            existingDri.setApproved(!(numApprovers > 0 && existingDri.approvedCount() < numApprovers));
        }

        DynamicRegistrationInfo savedEntity = repository.save(existingDri);
        return new DynamicRegistrationRepresentation(savedEntity);
    }
}