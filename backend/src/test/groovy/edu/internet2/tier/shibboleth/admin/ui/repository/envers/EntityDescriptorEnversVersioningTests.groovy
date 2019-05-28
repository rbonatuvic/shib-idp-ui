package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
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
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.getRevisionHistory
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.updateAndGetRevisionHistory
import static org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration.ADMINISTRATIVE
import static org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration.OTHER

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
    EntityDescriptorService entityDescriptorService

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
        def entityDescriptorHistory = getRevisionHistory(entityManager)

        then:
        entityDescriptorHistory.size() == 1

        when:
        def representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'administrative', name: 'nameUPDATED', emailAddress: 'test@test')]
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 2
        entityDescriptorHistory[1][0].contactPersons[0].givenName.name == 'nameUPDATED'
        entityDescriptorHistory[1][0].contactPersons[0].type == ADMINISTRATIVE
        entityDescriptorHistory[1][1].principalUserName == 'anonymous'
        entityDescriptorHistory[1][1].timestamp > 0L

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'other', name: 'nameUPDATED', emailAddress: 'test@test.com')]
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation,
                entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 3
        entityDescriptorHistory[2][0].contactPersons[0].givenName.name == 'nameUPDATED'
        entityDescriptorHistory[2][0].contactPersons[0].type == OTHER
        entityDescriptorHistory[2][0].contactPersons[0].emailAddresses[0].address == 'test@test.com'
        entityDescriptorHistory[2][1].principalUserName == 'anonymous'
        entityDescriptorHistory[2][1].timestamp > 0L

        //Also make sure we have our original revision
        entityDescriptorHistory[0][0].contactPersons[0].givenName.name == 'name'
        entityDescriptorHistory[0][0].contactPersons[0].type == ADMINISTRATIVE
        entityDescriptorHistory[0][0].contactPersons[0].emailAddresses[0].address == 'test@test'
        entityDescriptorHistory[0][1].principalUserName == 'anonymous'
        entityDescriptorHistory[0][1].timestamp > 0L

    }
}
