package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import org.hibernate.envers.AuditReaderFactory
import org.hibernate.envers.query.AuditQuery
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.domain.util.entitydescriptors.EntityDescriptors.prebakedEntityDescriptor
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.doInExplicitTransaction

/**
 * Testing entity descriptor envers versioning
 */
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EntityDescriptorEnversVersioningTests extends Specification {

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    PlatformTransactionManager txMgr

    @Autowired
    OpenSamlObjects openSamlObjects

    def "test versioning with contact persons"() {
        when:
        EntityDescriptor ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(prebakedEntityDescriptor(openSamlObjects))
        }
        def entityDescriptorHistory = resolverHistory()

        then:
        entityDescriptorHistory.size() == 1
    }

    private resolverHistory() {
        def auditReader = AuditReaderFactory.get(entityManager)
        AuditQuery auditQuery = auditReader
                .createQuery()
                .forRevisionsOfEntity(EntityDescriptor, false, false)
        auditQuery.resultList

    }
}
