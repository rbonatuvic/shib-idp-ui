package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * API containing operations pertaining to {@link EntityDescriptor} versioning.
 */
public interface EntityDescriptorVersionService {

    List<Version> findVersionsForEntityDescriptor(String resourceId);

    EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionId);

    /* Factory method to return stub impl for dev and testing purposes */
    static EntityDescriptorVersionService stubImpl(final EntityDescriptorService entityDescriptorService) {
        return new EntityDescriptorVersionService() {
            @Override
            public List<Version> findVersionsForEntityDescriptor(String resourceId) {
                return Arrays.asList(
                        new Version("1", "kramer", LocalDateTime.now().minusDays(10)),
                        new Version("2", "newman", LocalDateTime.now().minusDays(5))
                );
            }

            @Override
            public EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionId) {
                EntityDescriptor ed = new EntityDescriptor();
                ed.setID("1");
                ed.setEntityID("http://versioning/stub");
                ed.setCreatedBy("kramer");
                ed.setCreatedDate(LocalDateTime.now().minusDays(10));
                return entityDescriptorService.createRepresentationFromDescriptor(ed);
            }
        };
    }
}
