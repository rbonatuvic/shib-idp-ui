package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import edu.internet2.tier.shibboleth.admin.ui.envers.PrincipalAwareRevisionEntity;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.data.jpa.repository.JpaContext;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;

/**
 * Hibernate Envers based implementation of {@link EntityDescriptorVersionService}.
 * TODO: refactor this implementation using EnversVersionServiceSupport class
 */
public class EnversEntityDescriptorVersionService implements EntityDescriptorVersionService {

    private EntityManager entityManager;

    private EntityDescriptorService entityDescriptorService;

    public EnversEntityDescriptorVersionService(EntityManager entityManager, EntityDescriptorService entityDescriptorService) {
        this.entityManager = entityManager;
        this.entityDescriptorService = entityDescriptorService;
    }

    @Override
    public List<Version> findVersionsForEntityDescriptor(String resourceId) {
        List revs = AuditReaderFactory.get(entityManager).createQuery()
                .forRevisionsOfEntity(EntityDescriptor.class, false, false)
                .add(AuditEntity.property("resourceId").eq(resourceId))
                .getResultList();

        Object listOfVersions = revs.stream()
                .map(it -> ((Object[])it)[1])
                .map(it -> {
                    return new Version(((PrincipalAwareRevisionEntity) it).idAsString(),
                            ((PrincipalAwareRevisionEntity) it).getPrincipalUserName(),
                            ((PrincipalAwareRevisionEntity) it).getRevisionDate()
                                    .toInstant()
                                    .atOffset(ZoneOffset.UTC)
                                    .toZonedDateTime());
                })
                .sorted(comparing(Version::getDate))
                .collect(toList());

        return (List<Version>)listOfVersions;
    }

    @Override
    public EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionId) {
        try {
            Object revision = AuditReaderFactory.get(entityManager).createQuery()
                    .forEntitiesAtRevision(EntityDescriptor.class, Integer.valueOf(versionId))
                    .add(AuditEntity.property("resourceId").eq(resourceId))
                    .add(AuditEntity.revisionNumber().eq(Integer.valueOf(versionId)))
                    .getSingleResult();
            return entityDescriptorService.createRepresentationFromDescriptor((EntityDescriptor) revision);
        }
        catch (NoResultException e) {
            return null;
        }
    }
}
