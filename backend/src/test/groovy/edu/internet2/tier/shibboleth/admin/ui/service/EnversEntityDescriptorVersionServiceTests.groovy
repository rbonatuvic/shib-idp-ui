package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.EntitiesVersioningConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.*
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.doInExplicitTransaction

@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration, EntitiesVersioningConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EnversEntityDescriptorVersionServiceTests extends Specification {

    @Autowired
    EntityDescriptorVersionService entityDescriptorVersionService

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityDescriptorService entityDescriptorService

    @Autowired
    PlatformTransactionManager txMgr

    def "temp test"() {
        def representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'administrative', name: 'name', emailAddress: 'test@test')]
            it
        }
        EntityDescriptor ed = entityDescriptorService.createDescriptorFromRepresentation(representation)
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        ed.entityID = "Entity ID"
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }

        def versions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        expect:
        true
    }
}
