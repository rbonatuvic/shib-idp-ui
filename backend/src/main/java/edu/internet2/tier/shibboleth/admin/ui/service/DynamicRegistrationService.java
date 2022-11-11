package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;

public interface DynamicRegistrationService {
    Object getAllDynamicRegistrationsBasedOnUserAccess() throws ForbiddenException;

    DynamicRegistrationRepresentation createNew(DynamicRegistrationRepresentation dynRegRepresentation) throws ObjectIdExistsException;
}