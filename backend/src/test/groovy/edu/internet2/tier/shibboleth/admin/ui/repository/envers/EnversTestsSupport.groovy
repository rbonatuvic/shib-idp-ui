package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import org.hibernate.envers.AuditReaderFactory
import org.hibernate.envers.query.AuditQuery
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.DefaultTransactionDefinition

import javax.persistence.EntityManager

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

    static updateAndGetRevisionHistory(EntityDescriptor ed, EntityDescriptorRepresentation representation,
                                       EntityDescriptorService eds,
                                       EntityDescriptorRepository edr,
                                       PlatformTransactionManager txMgr,
                                       EntityManager em) {
        eds.updateDescriptorFromRepresentation(ed, representation)
        doInExplicitTransaction(txMgr) {
            edr.save(ed)
        }

        //For temp debugging. Remove when done!
        //def updated = edr.findByResourceId(ed.resourceId)

        getRevisionHistory(em)
    }

    static getRevisionHistory(EntityManager em) {
        def auditReader = AuditReaderFactory.get(em)
        AuditQuery auditQuery = auditReader
                .createQuery()
                .forRevisionsOfEntity(EntityDescriptor, false, false)
        auditQuery.resultList
    }
}
