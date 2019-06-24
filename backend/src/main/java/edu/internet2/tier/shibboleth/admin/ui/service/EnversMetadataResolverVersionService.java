package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import edu.internet2.tier.shibboleth.admin.ui.envers.EnversVersionServiceSupport;
import edu.internet2.tier.shibboleth.admin.ui.envers.PrincipalAwareRevisionEntity;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.time.ZoneId;
import java.util.List;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;

/**
 * Hibernate Envers based implementation of {@link MetadataResolverVersionService}.
 */
public class EnversMetadataResolverVersionService implements MetadataResolverVersionService {


    private EnversVersionServiceSupport enversVersionServiceSupport;

    public EnversMetadataResolverVersionService(EnversVersionServiceSupport enversVersionServiceSupport) {
        this.enversVersionServiceSupport = enversVersionServiceSupport;
    }

    @Override
    public List<Version> findVersionsForMetadataResolver(String resourceId) {
        return enversVersionServiceSupport.findVersionsForPersistentEntity(resourceId, MetadataResolver.class);
    }

    @Override
    public MetadataResolver findSpecificVersionOfMetadataResolver(String resourceId, String versionId) {
        Object mrObject = enversVersionServiceSupport.findSpecificVersionOfPersistentEntity(resourceId, versionId, MetadataResolver.class);
        return mrObject == null ? null : (MetadataResolver) mrObject;
    }
}
