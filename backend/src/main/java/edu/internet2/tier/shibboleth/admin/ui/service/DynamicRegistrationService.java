package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;

import java.util.List;

public interface DynamicRegistrationService {
    DynamicRegistrationRepresentation approveDynamicRegistration(String resourceId, boolean status)
                    throws PersistentEntityNotFound, ForbiddenException;

    DynamicRegistrationRepresentation createNew(DynamicRegistrationRepresentation dynRegRepresentation) throws ObjectIdExistsException;

    void delete(String resourceId) throws ForbiddenException, PersistentEntityNotFound;

    DynamicRegistrationRepresentation enableDynamicRegistration(String resourceId) throws PersistentEntityNotFound, ForbiddenException;

    List<DynamicRegistrationRepresentation> getAllDynamicRegistrationsBasedOnUserAccess() throws ForbiddenException;

    List<DynamicRegistrationRepresentation> getAllDynamicRegistrationsNeedingApprovalBasedOnUserAccess() throws ForbiddenException;

    List<DynamicRegistrationRepresentation> getDisabledDynamicRegistrations() throws ForbiddenException;

    DynamicRegistrationRepresentation update(DynamicRegistrationRepresentation dynRegRepresentation) throws PersistentEntityNotFound, ForbiddenException;

    DynamicRegistrationRepresentation updateGroupForDynamicRegistration(String resourceId, String groupId) throws ForbiddenException, PersistentEntityNotFound;
}