package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import org.hibernate.envers.AuditReaderFactory
import org.hibernate.envers.query.AuditQuery
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.DefaultTransactionDefinition
import spock.lang.Specification

import javax.persistence.EntityManager

import static org.springframework.transaction.TransactionDefinition.PROPAGATION_REQUIRES_NEW

/**
 * Testing metadata resolvers basic versioning by envers is functioning.
 */
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class MetadataResolverEntityBasicEnversVersioningTests extends Specification {

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    PlatformTransactionManager txMgr

    def "test basic audit and version data is created when persisting base metadata resolver with envers enabled"() {
        when:
        MetadataResolver mdr = doInExplicitTransaction {
            metadataResolverRepository.save(create {new MetadataResolver()})
        }
        def metadataResolverHistory = resolverHistory()

        then:
        metadataResolverHistory

        when:
        mdr.name = 'Updated'
        doInExplicitTransaction {
            metadataResolverRepository.save(mdr)
        }
        metadataResolverHistory = resolverHistory()

        then:
        metadataResolverHistory
    }

    private resolverHistory() {
        def auditReader = AuditReaderFactory.get(entityManager)
        AuditQuery auditQuery = auditReader
                .createQuery()
                .forRevisionsOfEntity(MetadataResolver, false, true)
        auditQuery.resultList

    }

    private static create(Closure concreteResolverSupplier) {
        MetadataResolver resolver = concreteResolverSupplier()
        resolver.with {
            it.name = "testme"
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.value = ["hola"]
                    return it
                }
                return it
            })
        }
        resolver
    }

    //This explicit low level transaction dance is required in order to verify history/version data that envers
    //writes out only after the explicit transaction is committed, therefore making it impossible to verify within the main tx
    //boundary of the test method which commits tx only after an execution of the test method. This let's us explicitly
    //start/commit transaction making envers data written out and verifiable
    private doInExplicitTransaction(Closure uow) {
        def txStatus = txMgr.getTransaction(new DefaultTransactionDefinition(PROPAGATION_REQUIRES_NEW))
        def entity = uow()
        txMgr.commit(txStatus)
        entity
    }
}
