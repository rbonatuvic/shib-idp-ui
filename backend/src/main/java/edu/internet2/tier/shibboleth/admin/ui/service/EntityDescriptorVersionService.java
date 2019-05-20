package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;

import java.util.List;

/**
 * API containing operations pertaining to {@link EntityDescriptor} versioning.
 */
public interface EntityDescriptorVersionService {

    List<Version> findVersionsForEntityDescriptor(String resourceId);

    EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionToken);
}
