package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.IShibUiPermissionEvaluator;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.PermissionType;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.ShibUiPermissibleType;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
@NoArgsConstructor
public class JPADynamicRegistrationServiceImpl implements DynamicRegistrationService {
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

    private boolean entityExists(String id) {
        return repository.findByResourceId(id) != null ;
    }

    @Override
    public List<DynamicRegistrationInfo> getAllDynamicRegistrationsBasedOnUserAccess() throws ForbiddenException {
        return (List<DynamicRegistrationInfo>) shibUiAuthorizationDelegate.getPersistentEntities(userService.getCurrentUserAuthentication(), ShibUiPermissibleType.dynamicRegistrationInfo, PermissionType.fetch);
    }
}