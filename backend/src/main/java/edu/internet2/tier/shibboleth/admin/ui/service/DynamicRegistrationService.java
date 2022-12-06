package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.MissingRequiredFieldsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.UnsupportedShibUiOperationException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import org.springframework.http.HttpStatus;

import java.util.List;

public interface DynamicRegistrationService {
    DynamicRegistrationRepresentation approveDynamicRegistration(String resourceId, boolean status)
                    throws PersistentEntityNotFound, ForbiddenException;

    void checkApprovalStatusOfEntitiesForGroup(Group result);

    DynamicRegistrationRepresentation createNew(DynamicRegistrationRepresentation dynRegRepresentation) throws ObjectIdExistsException,
                    MissingRequiredFieldsException;

    void delete(String resourceId) throws ForbiddenException, PersistentEntityNotFound;

    HttpStatus enableDynamicRegistration(String resourceId)
                    throws PersistentEntityNotFound, ForbiddenException, UnsupportedShibUiOperationException;

    List<DynamicRegistrationRepresentation> getAllDynamicRegistrationsBasedOnUserAccess() throws ForbiddenException;

    List<DynamicRegistrationRepresentation> getAllDynamicRegistrationsNeedingApprovalBasedOnUserAccess() throws ForbiddenException;

    List<DynamicRegistrationRepresentation> getDisabledDynamicRegistrations() throws ForbiddenException;

    DynamicRegistrationRepresentation getOne(String resourceId) throws ForbiddenException;

    DynamicRegistrationRepresentation update(DynamicRegistrationRepresentation dynRegRepresentation) throws PersistentEntityNotFound, ForbiddenException;

    DynamicRegistrationRepresentation updateGroupForDynamicRegistration(String resourceId, String groupId) throws ForbiddenException, PersistentEntityNotFound;
}