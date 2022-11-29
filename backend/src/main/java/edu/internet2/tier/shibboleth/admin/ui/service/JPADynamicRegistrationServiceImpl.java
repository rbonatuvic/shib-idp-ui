package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.MissingRequiredFieldsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.UnsupportedShibUiOperationException;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
@NoArgsConstructor
public class JPADynamicRegistrationServiceImpl implements DynamicRegistrationService {
    @Autowired
    private IGroupService groupService;

    @Autowired
    private DynamicRegistrationInfoRepository repository;

    @Autowired
    private OwnershipRepository ownershipRepository;

    private ShibRestTemplateDelegate shibRestTemplateDelegate;

    @Autowired
    private IShibUiPermissionEvaluator shibUiAuthorizationDelegate;

    @Autowired
    private UserService userService;

    @Override
    public DynamicRegistrationRepresentation approveDynamicRegistration(String resourceId, boolean status) throws PersistentEntityNotFound, ForbiddenException {
        DynamicRegistrationInfo dri = repository.findByResourceId(resourceId);
        if (dri == null) {
            throw new PersistentEntityNotFound("Dynamic Registration with resourceid[ " + resourceId + " ] was not found for approval");
        }
        return changeApproveStatusOfDynamicRepresentation(dri, status);
    }

    private DynamicRegistrationRepresentation changeApproveStatusOfDynamicRepresentation(DynamicRegistrationInfo dri, boolean status) throws ForbiddenException {
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), dri, PermissionType.approve)) {
            throw new ForbiddenException("You do not have the permissions necessary to approve this dynamic registration.");
        }
        if (status) { // approve
            int approvedCount = dri.approvedCount(); // total number of approvals so far
            List<Approvers> theApprovers = groupService.find(dri.getIdOfOwner()).getApproversList();
            if (theApprovers.size() > approvedCount) { // don't add if we already have enough approvals
                dri.addApproval(userService.getCurrentUserGroup());
            }
            dri.setApproved(dri.approvedCount() >= theApprovers.size()); // future check for multiple approvals needed
            dri = repository.save(dri);
        } else { // un-approve
            dri.removeLastApproval();
            Group ownerGroup = groupService.find(dri.getIdOfOwner());
            dri.setApproved(dri.approvedCount() >= ownerGroup.getApproversList().size()); // safe check in case of weird race conditions from the UI
            dri = repository.save(dri);
        }
        return new DynamicRegistrationRepresentation(dri);
    }

    @Override
    public DynamicRegistrationRepresentation createNew(DynamicRegistrationRepresentation dynRegRepresentation) throws ObjectIdExistsException, MissingRequiredFieldsException {
        if (entityExists(dynRegRepresentation.getResourceId())) {
            throw new ObjectIdExistsException(dynRegRepresentation.getResourceId());
        }

        if (StringUtils.isEmpty(dynRegRepresentation.getName()) || StringUtils.isEmpty(dynRegRepresentation.getRedirectUris())) {
            throw new MissingRequiredFieldsException("Name and Redirect URIs are both required to create new Dynamic Registration");
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

    private List<DynamicRegistrationRepresentation> convertToRepresentations(List<DynamicRegistrationInfo> temp) {
        List<DynamicRegistrationRepresentation> result = new ArrayList<>();
        temp.forEach(dri -> result.add(new DynamicRegistrationRepresentation(dri)));
        return result;
    }

    @Override
    public void delete(String resourceId) throws ForbiddenException, PersistentEntityNotFound {
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), null, PermissionType.admin)) {
            throw new ForbiddenException("Deleting a Dynamic Registration Source is only allowed by an admin.");
        }
        DynamicRegistrationInfo dri = repository.findByResourceId(resourceId);
        if (dri == null) {
            throw new PersistentEntityNotFound("Dynamic Registration not found for resource id: " + resourceId);
        }
        if (dri.isEnabled()) {
            throw new ForbiddenException("Deleting an enabled Dynamic Registration Source is not allowed.");
        }
        ownershipRepository.deleteEntriesForOwnedObject(dri);
        repository.delete(dri);
    }

    @Override
    public HttpStatus enableDynamicRegistration(String resourceId) throws PersistentEntityNotFound, ForbiddenException, UnsupportedShibUiOperationException {
        DynamicRegistrationInfo existingDri = repository.findByResourceId(resourceId);
        if (existingDri == null) {
            throw new PersistentEntityNotFound(String.format("The dynamic registration with id [%s] was not found for update.", existingDri.getResourceId()));
        }
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), existingDri, PermissionType.enable)) {
            throw new ForbiddenException("You do not have the permissions necessary to enable this service");
        }
        return shibRestTemplateDelegate.sendRequest(existingDri);
    }

    private boolean entityExists(String id) {
        return repository.findByResourceId(id) != null ;
    }

    @Override
    public List<DynamicRegistrationRepresentation> getAllDynamicRegistrationsBasedOnUserAccess() throws ForbiddenException {
        List<DynamicRegistrationInfo> temp = (List<DynamicRegistrationInfo>) shibUiAuthorizationDelegate.getPersistentEntities(userService.getCurrentUserAuthentication(), ShibUiPermissibleType.dynamicRegistrationInfo, PermissionType.fetch);
        return convertToRepresentations(temp);
    }

    @Override
    public List<DynamicRegistrationRepresentation> getAllDynamicRegistrationsNeedingApprovalBasedOnUserAccess() throws ForbiddenException {
        List<DynamicRegistrationInfo> temp =  (List<DynamicRegistrationInfo>) shibUiAuthorizationDelegate.getPersistentEntities(userService.getCurrentUserAuthentication(), ShibUiPermissibleType.dynamicRegistrationInfo, PermissionType.approve);
        return convertToRepresentations(temp);
    }

    @Override
    public List<DynamicRegistrationRepresentation> getDisabledDynamicRegistrations() throws ForbiddenException {
        List<DynamicRegistrationInfo> temp =  (List<DynamicRegistrationInfo>) shibUiAuthorizationDelegate.getPersistentEntities(userService.getCurrentUserAuthentication(), ShibUiPermissibleType.dynamicRegistrationInfo, PermissionType.enable);
        return convertToRepresentations(temp);
    }

    @Override
    public DynamicRegistrationRepresentation getOne(String resourceId) throws ForbiddenException {
        DynamicRegistrationInfo existingDri = repository.findByResourceId(resourceId);
        if (!shibUiAuthorizationDelegate.hasPermission(userService.getCurrentUserAuthentication(), existingDri, PermissionType.viewOrEdit)) {
            throw new ForbiddenException();
        }
        return new DynamicRegistrationRepresentation(existingDri);
    }

    @Override
    public DynamicRegistrationRepresentation update(DynamicRegistrationRepresentation dynRegRepresentation)
                    throws PersistentEntityNotFound, ForbiddenException, ConcurrentModificationException {
        DynamicRegistrationInfo existingDri = repository.findByResourceId(dynRegRepresentation.getResourceId());
        if (existingDri == null) {
            throw new PersistentEntityNotFound(String.format("The dynamic registration with id [%s] was not found for update.", existingDri.getResourceId()));
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
            throw new PersistentEntityNotFound(String.format("The dynamic registration with id [%s] was not found for update.", existingDri.getResourceId()));
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