package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import edu.internet2.tier.shibboleth.admin.ui.envers.EnversVersionServiceSupport;

import java.util.List;

/**
 * Hibernate Envers based implementation of {@link EntityDescriptorVersionService}.*
 */
public class EnversEntityDescriptorVersionService implements EntityDescriptorVersionService {

    private EnversVersionServiceSupport enversVersionServiceSupport;

    private EntityDescriptorService entityDescriptorService;

    public EnversEntityDescriptorVersionService(EnversVersionServiceSupport enversVersionServiceSupport, EntityDescriptorService entityDescriptorService) {
        this.enversVersionServiceSupport = enversVersionServiceSupport;
        this.entityDescriptorService = entityDescriptorService;
    }

    @Override
    public List<Version> findVersionsForEntityDescriptor(String resourceId) {
        return enversVersionServiceSupport.findVersionsForPersistentEntity(resourceId, EntityDescriptor.class);
    }

    @Override
    public EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionId) {
        Object edObject = enversVersionServiceSupport.findSpecificVersionOfPersistentEntity(resourceId, versionId, EntityDescriptor.class);
        return edObject == null ? null : entityDescriptorService.createRepresentationFromDescriptor((EntityDescriptor) edObject);
    }
}
