package edu.internet2.tier.shibboleth.admin.ui.envers;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.time.ZoneOffset;
import java.util.List;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;

/**
 * Encapsulates common functionality interfacing with Envers AuditReader low level API
 * to query for revisions of various persistent entities.
 */
public class EnversVersionServiceSupport {

    private EntityManager entityManager;

    public EnversVersionServiceSupport(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<Version> findVersionsForPersistentEntity(String resourceId, Class<?> entityClass) {
        List revs = AuditReaderFactory.get(entityManager).createQuery()
                .forRevisionsOfEntity(entityClass, false, false)
                .add(AuditEntity.property("resourceId").eq(resourceId))
                .getResultList();

        Object listOfVersions = revs.stream()
                //.map(it -> ((Object[]) it))
                .map(it -> {
                    return new Version(((PrincipalAwareRevisionEntity) ((Object[]) it)[1]).idAsString(),
                            ((AbstractAuditable) ((Object[]) it)[0]).getModifiedBy(),
                            ((AbstractAuditable) ((Object[]) it)[0]).modifiedDateAsZonedDateTime());
                })
                .sorted(comparing(Version::getDate))
                .collect(toList());

        return (List<Version>) listOfVersions;
    }

    public Object findSpecificVersionOfPersistentEntity(String resourceId, String versionId, Class<?> entityClass) {
        try {
            return AuditReaderFactory.get(entityManager).createQuery()
                    .forEntitiesAtRevision(entityClass, Integer.valueOf(versionId))
                    .add(AuditEntity.property("resourceId").eq(resourceId))
                    .add(AuditEntity.revisionNumber().eq(Integer.valueOf(versionId)))
                    .getSingleResult();
        }
        catch (NoResultException e) {
            return null;
        }
    }
}
