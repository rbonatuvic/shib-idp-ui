package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.UIInfo
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import javax.persistence.EntityManager
import java.time.LocalDateTime

import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.updateAndGetRevisionHistory
import static org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration.ADMINISTRATIVE
import static org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration.OTHER
import static org.springframework.test.annotation.DirtiesContext.MethodMode.AFTER_METHOD
import static org.springframework.test.annotation.DirtiesContext.MethodMode.BEFORE_METHOD

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

    @DirtiesContext
    def "test versioning with contact persons"() {
        when:
        def ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'administrative', name: 'name', emailAddress: 'test@test')]
            it
        }
        def entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 1
        entityDescriptorHistory[0][0].contactPersons[0].givenName.name == 'name'
        entityDescriptorHistory[0][0].contactPersons[0].type == ADMINISTRATIVE
        entityDescriptorHistory[0][0].contactPersons[0].emailAddresses[0].address == 'test@test'
        entityDescriptorHistory[0][1].principalUserName == 'anonymous'
        entityDescriptorHistory[0][1].timestamp > 0L

        when:
        representation = new EntityDescriptorRepresentation().with {
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
        entityDescriptorHistory[1][0].contactPersons[0].emailAddresses[0].address == 'test@test'
        entityDescriptorHistory[1][1].principalUserName == 'anonymous'
        entityDescriptorHistory[1][1].timestamp > 0L

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'other', name: 'nameUPDATED2', emailAddress: 'test@test.com')]
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation,
                entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 3
        entityDescriptorHistory[2][0].contactPersons[0].givenName.name == 'nameUPDATED2'
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

    @DirtiesContext
    def "test versioning with organization"() {
        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.organization = new OrganizationRepresentation(name: 'org', displayName: 'display org', url: 'http://org.edu')
            it
        }
        def entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)
        then:
        entityDescriptorHistory.size() == 1
        entityDescriptorHistory[0][0].organization.organizationNames[0].value == 'org'
        entityDescriptorHistory[0][0].organization.displayNames[0].value == 'display org'
        entityDescriptorHistory[0][0].organization.URLs[0].value == 'http://org.edu'
        entityDescriptorHistory[0][1].principalUserName == 'anonymous'
        entityDescriptorHistory[0][1].timestamp > 0L

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.organization = new OrganizationRepresentation(name: 'orgUpdated', displayName: 'display org Updated', url: 'http://org2.edu')
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)
        then:
        entityDescriptorHistory.size() == 2
        entityDescriptorHistory[1][0].organization.organizationNames[0].value == 'orgUpdated'
        entityDescriptorHistory[1][0].organization.displayNames[0].value == 'display org Updated'
        entityDescriptorHistory[1][0].organization.URLs[0].value == 'http://org2.edu'
        entityDescriptorHistory[1][1].principalUserName == 'anonymous'
        entityDescriptorHistory[1][1].timestamp > 0L

        //Check the original revision is intact
        entityDescriptorHistory[0][0].organization.organizationNames[0].value == 'org'
        entityDescriptorHistory[0][0].organization.displayNames[0].value == 'display org'
        entityDescriptorHistory[0][0].organization.URLs[0].value == 'http://org.edu'
        entityDescriptorHistory[0][1].principalUserName == 'anonymous'
        entityDescriptorHistory[0][1].timestamp > 0L
    }

    @DirtiesContext
    def "test versioning with sp sso descriptor"() {
        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                it.protocolSupportEnum = 'SAML 1.1'
                it.nameIdFormats = ['format']
                it
            }
            it
        }
        def entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 1
        entityDescriptorHistory[0][0].roleDescriptors[0].nameIDFormats[0].format == 'format'
        entityDescriptorHistory[0][0].roleDescriptors[0].supportedProtocols[0] == 'urn:oasis:names:tc:SAML:1.1:protocol'
        entityDescriptorHistory[0][0].roleDescriptors[0].supportedProtocols[1] == null
        entityDescriptorHistory[0][1].principalUserName == 'anonymous'
        entityDescriptorHistory[0][1].timestamp > 0L

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                it.protocolSupportEnum = 'SAML 1.1, SAML 2'
                it.nameIdFormats = ['formatUPDATED']
                it
            }
            it
        }

        //Currently this is the ONLY way to let envers recognize update revision type for EntityDescriptor type
        //when modifying SPSSODescriptor inside RoleDescriptors collection. This date "touch" would need to be encapsulated
        //perhaps in JPAEntityDescriptorServiceImpl#buildDescriptorFromRepresentation
        ed.modifiedDate = LocalDateTime.now()

        entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 2
        entityDescriptorHistory[1][0].roleDescriptors[0].nameIDFormats[0].format == 'formatUPDATED'
        entityDescriptorHistory[1][0].roleDescriptors[0].supportedProtocols[0] == 'urn:oasis:names:tc:SAML:1.1:protocol'
        entityDescriptorHistory[1][0].roleDescriptors[0].supportedProtocols[1] == 'urn:oasis:names:tc:SAML:2.0:protocol'
        entityDescriptorHistory[1][1].principalUserName == 'anonymous'
        entityDescriptorHistory[1][1].timestamp > 0L

        //Check the original revision is intact
        entityDescriptorHistory[0][0].roleDescriptors[0].nameIDFormats[0].format == 'format'
        entityDescriptorHistory[0][0].roleDescriptors[0].supportedProtocols[0] == 'urn:oasis:names:tc:SAML:1.1:protocol'
        entityDescriptorHistory[0][0].roleDescriptors[0].supportedProtocols[1] == null
        entityDescriptorHistory[0][1].principalUserName == 'anonymous'
        entityDescriptorHistory[0][1].timestamp > 0L
    }
    @DirtiesContext
    def "test versioning with uiInfo"() {
        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.mdui = new MduiRepresentation().with {
                it.displayName = 'Initial display name'
                it.informationUrl = 'http://info'
                it.privacyStatementUrl = 'http://privacy'
                it.description = 'Initial desc'
                it.logoUrl = 'http://logo'
                it.logoHeight = 20
                it.logoWidth = 30
                it
            }
            it
        }
        def entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        //Groovy FTW - able to call any private methods on ANY object. Get first revision
        UIInfo uiinfo = entityDescriptorService.getUIInfo(entityDescriptorHistory[0][0])

        then:
        entityDescriptorHistory.size() == 1
        uiinfo.displayNames[0].value == 'Initial display name'
        uiinfo.informationURLs[0].value == 'http://info'
        uiinfo.privacyStatementURLs[0].value == 'http://privacy'
        uiinfo.descriptions[0].value == 'Initial desc'
        uiinfo.logos[0].URL == 'http://logo'
        uiinfo.logos[0].height == 20
        uiinfo.logos[0].width == 30

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.mdui = new MduiRepresentation().with {
                it.displayName = 'Display name UPDATED'
                it.informationUrl = 'http://info.updated'
                it.privacyStatementUrl = 'http://privacy.updated'
                it.description = 'Desc UPDATED'
                it.logoUrl = 'http://logo.updated'
                it.logoHeight = 30
                it.logoWidth = 40
                it
            }
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistory(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        //Get second revision
        uiinfo = entityDescriptorService.getUIInfo(entityDescriptorHistory[1][0])
        //And initial revision
        def uiinfoInitialRevision = entityDescriptorService.getUIInfo(entityDescriptorHistory[0][0])

        then:
        entityDescriptorHistory.size() == 2
        uiinfo.displayNames[0].value == 'Display name UPDATED'
        uiinfo.informationURLs[0].value == 'http://info.updated'
        uiinfo.privacyStatementURLs[0].value == 'http://privacy.updated'
        uiinfo.descriptions[0].value == 'Desc UPDATED'
        uiinfo.logos[0].URL == 'http://logo.updated'
        uiinfo.logos[0].height == 30
        uiinfo.logos[0].width == 40

        //Check the initial revision is still intact
        uiinfoInitialRevision.displayNames[0].value == 'Initial display name'
        uiinfoInitialRevision.informationURLs[0].value == 'http://info'
        uiinfoInitialRevision.privacyStatementURLs[0].value == 'http://privacy'
        uiinfoInitialRevision.descriptions[0].value == 'Initial desc'
        uiinfoInitialRevision.logos[0].URL == 'http://logo'
        uiinfoInitialRevision.logos[0].height == 20
        uiinfoInitialRevision.logos[0].width == 30
    }
}
