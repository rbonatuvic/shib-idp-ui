package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;

import javax.persistence.EntityManager;
import java.util.List;

/**
 * Hibernate Envers based implementation of {@link EntityDescriptorVersionService}.
 */
public class EnversEntityDescriptorVersionService implements EntityDescriptorVersionService {

    private AuditReader auditReader;

    public EnversEntityDescriptorVersionService(EntityManager em) {

        this.auditReader = AuditReaderFactory.get(em);
    }

    @Override
    public List<Version> findVersionsForEntityDescriptor(String resourceId) {
        return null;
    }

    @Override
    public EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionId) {
        return null;
    }
}
