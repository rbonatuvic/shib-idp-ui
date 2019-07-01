package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import org.hibernate.envers.AuditReaderFactory
import org.hibernate.envers.query.AuditEntity
import org.hibernate.envers.query.AuditQuery
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.DefaultTransactionDefinition

import javax.persistence.EntityManager
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime

import static org.springframework.transaction.TransactionDefinition.PROPAGATION_REQUIRES_NEW

class EnversTestsSupport {

    //This explicit low level transaction dance is required in order to verify history/version data that envers
    //writes out only after the explicit transaction is committed, therefore making it impossible to verify within the main tx
    //boundary of the test method which commits tx only after an execution of the test method. This let's us explicitly
    //start/commit transaction making envers data written out and verifiable
    static doInExplicitTransaction(PlatformTransactionManager txMgr, Closure uow) {
        def txStatus = txMgr.getTransaction(new DefaultTransactionDefinition(PROPAGATION_REQUIRES_NEW))
        def entity = uow()
        txMgr.commit(txStatus)
        entity
    }

    static updateAndGetRevisionHistoryOfEntityDescriptor(EntityDescriptor ed, EntityDescriptorRepresentation representation,
                                                         EntityDescriptorService eds,
                                                         EntityDescriptorRepository edr,
                                                         PlatformTransactionManager txMgr,
                                                         EntityManager em) {
        eds.updateDescriptorFromRepresentation(ed, representation)
        doInExplicitTransaction(txMgr) {
            edr.save(ed)
        }
        getRevisionHistoryForEntityType(em, EntityDescriptor, ed.resourceId)
    }

    static updateAndGetRevisionHistoryOfMetadataResolver(MetadataResolver mr,
                                                         MetadataResolverRepository mrr,
                                                         Class < ? > type,
                                                         PlatformTransactionManager
                                                                 txMgr, EntityManager em) {

        doInExplicitTransaction(txMgr) {
            mrr.save(mr)
        }
        getRevisionHistoryForEntityType(em, type, mr.resourceId)
    }

    static getRevisionHistoryForEntityType(EntityManager em, Class<?> entityType, String resourceId) {
        def auditReader = AuditReaderFactory.get(em)
        AuditQuery auditQuery = auditReader
                .createQuery()
                .forRevisionsOfEntity(entityType, false, false)
                .add(AuditEntity.property("resourceId").eq(resourceId))
        auditQuery.resultList
    }

    static getTargetEntityForRevisionIndex(List<Object[]> revHistory, int revIndex) {
        revHistory[revIndex][0]
    }

    static getRevisionEntityForRevisionIndex(List<Object[]> revHistory, int revIndex) {
        revHistory[revIndex][1]
    }

    static getModifiedEntityNames(List<Object[]> revHistory, int revIndex) {
        getRevisionEntityForRevisionIndex(revHistory, revIndex).modifiedEntityNames
    }
}
