package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.*
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.*
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
import spock.lang.Ignore
import spock.lang.Specification

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.*
import static org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration.ADMINISTRATIVE
import static org.opensaml.saml.saml2.metadata.ContactPersonTypeEnumeration.OTHER

/**
 * Testing entity descriptor envers versioning
 */
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
//@Ignore
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
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name, ContactPerson.name, GivenName.name, EmailAddress.name]

        when:
        def ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'administrative', name: 'name', emailAddress: 'test@test')]
            it
        }
        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 1
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).contactPersons[0].givenName.name == 'name'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).contactPersons[0].type == ADMINISTRATIVE
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).contactPersons[0].emailAddresses[0].address == 'test@test'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'administrative', name: 'nameUPDATED', emailAddress: 'test@test')]
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)
        then:
        entityDescriptorHistory.size() == 2
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).contactPersons[0].givenName.name == 'nameUPDATED'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).contactPersons[0].type == ADMINISTRATIVE
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).contactPersons[0].emailAddresses[0].address == 'test@test'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.contacts = [new ContactRepresentation(type: 'other', name: 'nameUPDATED2', emailAddress: 'test@test.com')]
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation,
                entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 3
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 2).contactPersons[0].givenName.name == 'nameUPDATED2'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 2).contactPersons[0].type == OTHER
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 2).contactPersons[0].emailAddresses[0].address == 'test@test.com'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 2).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 2).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 2).sort() == expectedModifiedPersistentEntities.sort()

        //Also make sure we have our original revision
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).contactPersons[0].givenName.name == 'nameUPDATED'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).contactPersons[0].type == ADMINISTRATIVE
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).contactPersons[0].emailAddresses[0].address == 'test@test'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).timestamp > 0L

    }

    def "test versioning with organization"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  Organization.name,
                                                  OrganizationDisplayName.name,
                                                  OrganizationName.name,
                                                  OrganizationURL.name]

        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.organization = new OrganizationRepresentation(name: 'org', displayName: 'display org', url: 'http://org.edu')
            it
        }
        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)
        then:
        entityDescriptorHistory.size() == 1
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).organization.organizationNames[0].value == 'org'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).organization.displayNames[0].value == 'display org'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).organization.URLs[0].value == 'http://org.edu'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.organization = new OrganizationRepresentation(name: 'orgUpdated', displayName: 'display org Updated', url: 'http://org2.edu')
            it
        }
        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)
        then:
        entityDescriptorHistory.size() == 2
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).organization.organizationNames[0].value == 'orgUpdated'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).organization.displayNames[0].value == 'display org Updated'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).organization.URLs[0].value == 'http://org2.edu'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).organization.organizationNames[0].value == 'org'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).organization.displayNames[0].value == 'display org'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).organization.URLs[0].value == 'http://org.edu'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).timestamp > 0L
    }

    def "test versioning with sp sso descriptor"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  NameIDFormat.name,
                                                  SPSSODescriptor.name]
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
        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 1
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).roleDescriptors[0].nameIDFormats[0].format == 'format'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).roleDescriptors[0].supportedProtocols[0] == 'urn:oasis:names:tc:SAML:1.1:protocol'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).roleDescriptors[0].supportedProtocols[1] == null
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                it.protocolSupportEnum = 'SAML 1.1, SAML 2'
                it.nameIdFormats = ['formatUPDATED']
                it
            }
            it
        }

        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        then:
        entityDescriptorHistory.size() == 2
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).roleDescriptors[0].nameIDFormats[0].format == 'formatUPDATED'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).roleDescriptors[0].supportedProtocols[0] == 'urn:oasis:names:tc:SAML:1.1:protocol'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 1).roleDescriptors[0].supportedProtocols[1] == 'urn:oasis:names:tc:SAML:2.0:protocol'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 1).timestamp > 0L
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).roleDescriptors[0].nameIDFormats[0].format == 'format'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).roleDescriptors[0].supportedProtocols[0] == 'urn:oasis:names:tc:SAML:1.1:protocol'
        getTargetEntityForRevisionIndex(entityDescriptorHistory, 0).roleDescriptors[0].supportedProtocols[1] == null
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).principalUserName == 'anonymous'
        getRevisionEntityForRevisionIndex(entityDescriptorHistory, 0).timestamp > 0L
    }

    def "test versioning with uiInfo"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  Description.name,
                                                  DisplayName.name,
                                                  SPSSODescriptor.name,
                                                  Extensions.name,
                                                  InformationURL.name,
                                                  Logo.name,
                                                  PrivacyStatementURL.name,
                                                  UIInfo.name]

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
        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        //Groovy FTW - able to call any private methods on ANY object. Get first revision
        UIInfo uiinfo = entityDescriptorService.getUIInfo(getTargetEntityForRevisionIndex(entityDescriptorHistory, 0))

        then:
        entityDescriptorHistory.size() == 1
        uiinfo.displayNames[0].value == 'Initial display name'
        uiinfo.informationURLs[0].value == 'http://info'
        uiinfo.privacyStatementURLs[0].value == 'http://privacy'
        uiinfo.descriptions[0].value == 'Initial desc'
        uiinfo.logos[0].URL == 'http://logo'
        uiinfo.logos[0].height == 20
        uiinfo.logos[0].width == 30
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

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
        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        //Get second revision
        uiinfo = entityDescriptorService.getUIInfo(getTargetEntityForRevisionIndex(entityDescriptorHistory, 1))
        //And initial revision
        def uiinfoInitialRevision = entityDescriptorService.getUIInfo(getTargetEntityForRevisionIndex(entityDescriptorHistory, 0))

        then:
        entityDescriptorHistory.size() == 2
        uiinfo.displayNames[0].value == 'Display name UPDATED'
        uiinfo.informationURLs[0].value == 'http://info.updated'
        uiinfo.privacyStatementURLs[0].value == 'http://privacy.updated'
        uiinfo.descriptions[0].value == 'Desc UPDATED'
        uiinfo.logos[0].URL == 'http://logo.updated'
        uiinfo.logos[0].height == 30
        uiinfo.logos[0].width == 40
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the initial revision is still intact
        uiinfoInitialRevision.displayNames[0].value == 'Initial display name'
        uiinfoInitialRevision.informationURLs[0].value == 'http://info'
        uiinfoInitialRevision.privacyStatementURLs[0].value == 'http://privacy'
        uiinfoInitialRevision.descriptions[0].value == 'Initial desc'
        uiinfoInitialRevision.logos[0].URL == 'http://logo'
        uiinfoInitialRevision.logos[0].height == 20
        uiinfoInitialRevision.logos[0].width == 30
    }

    def "test versioning with security"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  KeyDescriptor.name,
                                                  KeyInfo.name,
                                                  SPSSODescriptor.name,
                                                  X509Certificate.name,
                                                  X509Data.name]

        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.authenticationRequestsSigned = true
                it.x509CertificateAvailable = true
                it.x509Certificates = [new SecurityInfoRepresentation.X509CertificateRepresentation(name: 'sign', type: 'signing', value: 'signingValue')]
                it
            }
            it
        }

        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        //Get initial revision
        SPSSODescriptor spssoDescriptor =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory,0))

        KeyDescriptor keyDescriptor = spssoDescriptor.keyDescriptors[0]
        X509Certificate x509cert = keyDescriptor.keyInfo.x509Datas[0].x509Certificates[0]

        then:
        entityDescriptorHistory.size() == 1
        spssoDescriptor.isAuthnRequestsSigned()
        keyDescriptor.name == 'sign'
        keyDescriptor.usageType == 'signing'
        x509cert.value == 'signingValue'
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.authenticationRequestsSigned = false
                it.x509CertificateAvailable = true
                it.x509Certificates = [new SecurityInfoRepresentation.X509CertificateRepresentation(name: 'sign', type: 'signing', value: 'signingValue'),
                                       new SecurityInfoRepresentation.X509CertificateRepresentation(name: 'encrypt', type: 'encryption', value: 'encryptionValue')]
                it
            }
            it
        }

        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)


        //Get second revision
        SPSSODescriptor spssoDescriptor_second = entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory,1))

        KeyDescriptor keyDescriptor_second1 = spssoDescriptor_second.keyDescriptors[0]
        X509Certificate x509cert_second1 = keyDescriptor_second1.keyInfo.x509Datas[0].x509Certificates[0]
        KeyDescriptor keyDescriptor_second2 = spssoDescriptor_second.keyDescriptors[1]
        X509Certificate x509cert_second2 = keyDescriptor_second2.keyInfo.x509Datas[0].x509Certificates[0]


        //Get initial revision
        spssoDescriptor =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory,0))

        keyDescriptor = spssoDescriptor.keyDescriptors[0]
        x509cert = keyDescriptor.keyInfo.x509Datas[0].x509Certificates[0]

        then:
        entityDescriptorHistory.size() == 2
        !spssoDescriptor_second.isAuthnRequestsSigned()
        keyDescriptor_second1.name == 'sign'
        keyDescriptor_second1.usageType == 'signing'
        keyDescriptor_second2.name == 'encrypt'
        keyDescriptor_second2.usageType == 'encryption'
        x509cert_second1.value == 'signingValue'
        x509cert_second2.value == 'encryptionValue'
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the initial version is intact
        spssoDescriptor.keyDescriptors.size() == 1
        spssoDescriptor.isAuthnRequestsSigned()
        keyDescriptor.name == 'sign'
        keyDescriptor.usageType == 'signing'
        x509cert.value == 'signingValue'
    }

    def "test versioning ACS"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  SPSSODescriptor.name,
                                                  AssertionConsumerService.name]

        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.assertionConsumerServices = [
                    new AssertionConsumerServiceRepresentation(locationUrl: 'http://acs', binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST')]
            it
        }

        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        SPSSODescriptor spssoDescriptor =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory,0))
        AssertionConsumerService acs = spssoDescriptor.assertionConsumerServices[0]

        then:
        entityDescriptorHistory.size() == 1
        !acs.isDefault()
        acs.location == 'http://acs'
        acs.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()


        when:
        representation = new EntityDescriptorRepresentation().with {
            it.assertionConsumerServices = [
                    new AssertionConsumerServiceRepresentation(locationUrl: 'http://acs.updated', binding: 'urn:oasis:names:tc:SAML:2.0:bindings:PAOS', makeDefault: true),
                    new AssertionConsumerServiceRepresentation(locationUrl: 'http://acs2', binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact')]
            it
        }

        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        SPSSODescriptor spssoDescriptor2 =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory,1))
        def (acs1, acs2) = [spssoDescriptor2.assertionConsumerServices[0], spssoDescriptor2.assertionConsumerServices[1]]

        //Initial revision
        spssoDescriptor =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory,0))
        acs = spssoDescriptor.assertionConsumerServices[0]

        then:
        entityDescriptorHistory.size() == 2
        acs1.isDefault()
        !acs2.isDefault()
        acs1.location == 'http://acs.updated'
        acs1.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:PAOS'
        acs2.location == 'http://acs2'
        acs2.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact'
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the initial revision is intact
        !acs.isDefault()
        acs.location == 'http://acs'
        acs.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
    }

    def "test versioning logout"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  SPSSODescriptor.name,
                                                  SingleLogoutService.name]

        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.logoutEndpoints = [new LogoutEndpointRepresentation(url: 'http://logout', bindingType: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST')]
            it
        }

        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        SPSSODescriptor spssoDescriptor =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory, 0))
        SingleLogoutService slo = spssoDescriptor.singleLogoutServices[0]

        then:
        entityDescriptorHistory.size() == 1
        slo.location == 'http://logout'
        slo.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.logoutEndpoints = [new LogoutEndpointRepresentation(url: 'http://logout.updated', bindingType: 'urn:oasis:names:tc:SAML:2.0:bindings:PAOS'),
                                  new LogoutEndpointRepresentation(url: 'http://logout2', bindingType: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact')]
            it
        }

        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        SPSSODescriptor spssoDescriptor2 =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory, 1))
        def (slo1, slo2) = [spssoDescriptor2.singleLogoutServices[0], spssoDescriptor2.singleLogoutServices[1]]

        //Initial revision
        spssoDescriptor =
                entityDescriptorService.getSPSSODescriptorFromEntityDescriptor(getTargetEntityForRevisionIndex(entityDescriptorHistory, 0))
        slo = spssoDescriptor.singleLogoutServices[0]

        then:
        entityDescriptorHistory.size() == 2
        slo1.location == 'http://logout.updated'
        slo1.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:PAOS'
        slo2.location == 'http://logout2'
        slo2.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact'
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the initial version is intact
        slo.location == 'http://logout'
        slo.binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
    }

    def "test versioning relying party overrides"() {
        setup:
        def expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                                  EntityAttributes.name,
                                                  Extensions.name,
                                                  Attribute.name,
                                                  XSBoolean.name,
                                                  XSString.name]

        when:
        EntityDescriptor ed = new EntityDescriptor()
        def representation = new EntityDescriptorRepresentation().with {
            it.relyingPartyOverrides = [signAssertion: true]
            it.attributeRelease = ['attr1']
            it
        }

        def entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        EntityAttributes attrs = entityDescriptorService.getEntityAttributes(getTargetEntityForRevisionIndex(entityDescriptorHistory, 0))

        then:
        entityDescriptorHistory.size() == 1
        attrs.attributes[0].attributeValues[0].storedValue == 'true'
        attrs.attributes[1].attributeValues[0].xsStringvalue == 'attr1'
        getModifiedEntityNames(entityDescriptorHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        representation = new EntityDescriptorRepresentation().with {
            it.relyingPartyOverrides = [signAssertion: false]
            it.attributeRelease = ['attr1', 'attr2']
            it
        }

        entityDescriptorHistory = updateAndGetRevisionHistoryOfEntityDescriptor(ed, representation, entityDescriptorService,
                entityDescriptorRepository,
                txMgr,
                entityManager)

        EntityAttributes attrs2 = entityDescriptorService.getEntityAttributes(getTargetEntityForRevisionIndex(entityDescriptorHistory, 1))

        //Initial revision
        attrs = entityDescriptorService.getEntityAttributes(getTargetEntityForRevisionIndex(entityDescriptorHistory, 0))

        expectedModifiedPersistentEntities = [EntityDescriptor.name,
                                              EntityAttributes.name,
                                              Attribute.name,
                                              XSString.name]
        then:
        entityDescriptorHistory.size() == 2
        attrs2.attributes[0].attributeValues[0].xsStringvalue == 'attr1'
        attrs2.attributes[0].attributeValues[1].xsStringvalue == 'attr2'
        getModifiedEntityNames(entityDescriptorHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the initial revision is intact
        attrs.attributes[0].attributeValues[0].storedValue == 'true'
        attrs.attributes[1].attributeValues[0].xsStringvalue == 'attr1'
        attrs.attributes[1].attributeValues[1] == null
    }
}
