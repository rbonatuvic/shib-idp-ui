package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.DefaultTransactionDefinition

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
}
