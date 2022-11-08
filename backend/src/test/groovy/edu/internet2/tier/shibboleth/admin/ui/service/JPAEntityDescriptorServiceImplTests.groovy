package edu.internet2.tier.shibboleth.admin.ui.service

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.JsonSchemaComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptorProtocol
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.KeyDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.OAuthRPExtensions
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.LowLevelJsonSchemaValidator
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.skyscreamer.jsonassert.JSONAssert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.json.JacksonTester
import org.springframework.context.annotation.PropertySource
import org.springframework.core.io.DefaultResourceLoader
import org.springframework.mock.http.MockHttpInputMessage
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.transaction.annotation.Transactional
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import org.xmlunit.diff.DefaultNodeMatcher
import org.xmlunit.diff.ElementSelectors
import spock.lang.Ignore

import java.time.LocalDateTime

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesOIDCSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSAMLSchema

@PropertySource("classpath:application.yml")
class JPAEntityDescriptorServiceImplTests extends AbstractBaseDataJpaTest {
    @Autowired
    EntityService entityService

    @Autowired
    ObjectMapper mapper

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    JPAEntityDescriptorServiceImpl service

    @Autowired
    TestObjectGenerator testObjectGenerator

    RandomGenerator generator
    JacksonTester<EntityDescriptorRepresentation> jacksonTester

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Transactional
    def setup() {
        JacksonTester.initFields(this, mapper)
        generator = new RandomGenerator()
        EntityDescriptorConversionUtils.openSamlObjects = openSamlObjects
        EntityDescriptorConversionUtils.entityService = entityService
        openSamlObjects.init()

        groupService.clearAllForTesting()
        List<Group> apprGroups = new ArrayList<>()
        String[] groupNames = ['BBB', 'CCC', 'EEE', 'AAA']
        groupNames.each {name -> {
            Group group = new Group().with({
                it.name = name
                it.description = name
                it.resourceId = name
                it
            })
            if (name != "AAA") {
                apprGroups.add(groupRepository.save(group))
            } else {
                Approvers approvers = new Approvers()
                approvers.setApproverGroups(apprGroups)
                List<Approvers> apprList = new ArrayList<>()
                apprList.add(approversRepository.save(approvers))
                group.setApproversList(apprList)
                groupRepository.save(group)
            }
        }}
        Group group = new Group().with({
            it.name = 'DDD'
            it.description = 'DDD'
            it.resourceId = 'DDD'
            it
        })
        Approvers approvers = new Approvers()
        apprGroups = new ArrayList<>()
        apprGroups.add(groupRepository.findByResourceId('BBB'))
        approvers.setApproverGroups(apprGroups)
        List<Approvers> apprList = new ArrayList<>()
        apprList.add(approversRepository.save(approvers))
        group.setApproversList(apprList)
        groupRepository.save(group)

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "bbUser", roles:[userRole.get()], password: "foo")
        user.setGroup(groupRepository.findByResourceId("BBB"))
        userService.save(user)

        entityManager.flush()
        entityManager.clear()
    }



    def "simple Entity Descriptor"() {
        when:
        def expected = '''<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1" />'''

        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.setEntityId('http://test.example.org/test1')
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().build()

        then:
        !diff.hasDifferences()
    }

    def "test organization setting"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
  <md:Organization>
    <md:OrganizationName xml:lang="en">name</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">display name</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">http://test.example.org</md:OrganizationURL>
  </md:Organization>
</md:EntityDescriptor>
                     '''

        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.organization = new OrganizationRepresentation().with {
                it.name = 'name'
                it.displayName = 'display name'
                it.url = 'http://test.example.org'
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test SPSSODescriptor configuration, single protocol"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol" />
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                it.protocolSupportEnum = 'SAML 2'
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test NameID formats"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor>
                        <md:NameIDFormat>nameidformat</md:NameIDFormat>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation().with {
                it.nameIdFormats = ['nameidformat']
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test single contacts setting"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:ContactPerson contactType="administrative">
                            <md:GivenName>givenName</md:GivenName>
                            <md:EmailAddress>email@example.org</md:EmailAddress>
                     </md:ContactPerson>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.contacts = [new ContactRepresentation().with {
                it.type = 'administrative'
                it.name = 'givenName'
                it.emailAddress = 'email@example.org'
                it
            }]
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test multiple contacts setting"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:ContactPerson contactType="administrative">
                            <md:GivenName>givenName</md:GivenName>
                            <md:EmailAddress>email@example.org</md:EmailAddress>
                     </md:ContactPerson>
                     <md:ContactPerson contactType="support">
                            <md:GivenName>support</md:GivenName>
                            <md:EmailAddress>support@example.org</md:EmailAddress>
                     </md:ContactPerson>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.contacts = [new ContactRepresentation().with {
                it.type = 'administrative'
                it.name = 'givenName'
                it.emailAddress = 'email@example.org'
                it
            }, new ContactRepresentation().with {
                it.type = 'support'
                it.name = 'support'
                it.emailAddress = 'support@example.org'
                it
            }]
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test MDUI setting"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor>
                        <md:Extensions>
                            <mdui:UIInfo xmlns:mdui="urn:oasis:names:tc:SAML:metadata:ui">
                                <mdui:DisplayName xml:lang="en">displayName</mdui:DisplayName>
                                <mdui:Description xml:lang="en">description</mdui:Description>
                                <mdui:InformationURL xml:lang="en">informationUrl</mdui:InformationURL>
                                <mdui:PrivacyStatementURL xml:lang="en">privacyUrl</mdui:PrivacyStatementURL>
                                <mdui:Logo height="10" width="11" xml:lang="en">logoUrl</mdui:Logo>
                            </mdui:UIInfo>
                        </md:Extensions>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.mdui = new MduiRepresentation().with {
                it.displayName = 'displayName'
                it.description = 'description'
                it.informationUrl = 'informationUrl'
                it.privacyStatementUrl = 'privacyUrl'
                it.logoUrl = 'logoUrl'
                it.logoHeight = 10
                it.logoWidth = 11
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().checkForSimilar().ignoreWhitespace().withNodeMatcher(new DefaultNodeMatcher(ElementSelectors.byNameAndText)).build()

        then:
        !diff.hasDifferences()
    }

    def "test security setting, signing"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor>
                        <md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" use="signing">
                          <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                            <ds:X509Data>
                              <ds:X509Certificate>certificate</ds:X509Certificate>
                            </ds:X509Data>
                          </ds:KeyInfo>
                        </md:KeyDescriptor>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.keyDescriptors = [new KeyDescriptorRepresentation().with {
                    it.type = 'signing'
                    it.value = 'certificate'
                    it.elementType = KeyDescriptorRepresentation.ElementType.X509Data
                    it
                }]
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test security setting, encryption"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor>
                        <md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" use="encryption">
                          <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                            <ds:X509Data>
                              <ds:X509Certificate>certificate</ds:X509Certificate>
                            </ds:X509Data>
                          </ds:KeyInfo>
                        </md:KeyDescriptor>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.keyDescriptors = [new KeyDescriptorRepresentation().with {
                    it.type = 'encryption'
                    it.value = 'certificate'
                    it.elementType = KeyDescriptorRepresentation.ElementType.X509Data
                    it
                }]
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test security setting, both"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor>
                        <md:KeyDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
                          <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                            <ds:X509Data>
                              <ds:X509Certificate>certificate</ds:X509Certificate>
                            </ds:X509Data>
                          </ds:KeyInfo>
                        </md:KeyDescriptor>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.keyDescriptors = [new KeyDescriptorRepresentation().with {
                    it.type = 'both'
                    it.value = 'certificate'
                    it.elementType = KeyDescriptorRepresentation.ElementType.X509Data
                    it
                }]
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test security setting, want assertions signed"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor WantAssertionsSigned="true">
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.wantAssertionsSigned = true
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test security setting, want requests signed"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor AuthnRequestsSigned="true">
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.securityInfo = new SecurityInfoRepresentation().with {
                it.authenticationRequestsSigned = true
                it
            }
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "SHIBUI-855, generate forceAuthn XML"() {
        when:

        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.example.org/test1">
  <md:Extensions>
    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
      <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" FriendlyName="forceAuthn" Name="http://shibboleth.net/ns/profiles/forceAuthn" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:boolean">true</saml2:AttributeValue>
      </saml2:Attribute>
    </mdattr:EntityAttributes>
  </md:Extensions>
</md:EntityDescriptor>
'''

        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.relyingPartyOverrides = ['forceAuthn': true]
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }


    def "SHIBUI-855, read forceAuthn from json"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-855.json').bytes, EntityDescriptorRepresentation)
        def output = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(representation))

        then:
        assert output.relyingPartyOverrides?.forceAuthn == representation.relyingPartyOverrides.get("forceAuthn")
    }

    def "test ACS configuration"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor>
                        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.example.org/SAML/POST" index="2"/>
                        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://test.example.org/SAML/GET" index="1" isDefault="true"/>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.assertionConsumerServices = [
                    new AssertionConsumerServiceRepresentation().with {
                        it.binding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
                        it.locationUrl = 'https://test.example.org/SAML/POST'
                        it.index = 2
                        it
                    },
                    new AssertionConsumerServiceRepresentation().with {
                        it.binding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'
                        it.locationUrl = 'https://test.example.org/SAML/GET'
                        it.makeDefault = true
                        it.index = 1
                        it
                    }
            ]
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "test logout configuration"() {
        when:
        def expected = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
                     <md:SPSSODescriptor><md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.example.org/SAML2/POST"/>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.logoutEndpoints = [
                    new LogoutEndpointRepresentation().with {
                        it.bindingType = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
                        it.url = 'https://test.example.org/SAML2/POST'
                        it
                    }
            ]
            it
        }))

        def diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(test)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }

    def "SHIBUI-199"() {
        when:
        def input = openSamlObjects.unmarshalFromXml this.class.getResource('/metadata/SHIBUI-199.xml').bytes
        def representation = service.createRepresentationFromDescriptor(input)

        then:
        !input.getContactPersons().empty && input.getContactPersons()[0].givenName.name == 'New Contact_EDIT'
        !representation.contacts.empty && representation.contacts[0].name == 'New Contact_EDIT'
    }

    def "SHIBUI-211"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-211.json').bytes, EntityDescriptorRepresentation)
        def interstitial = service.createDescriptorFromRepresentation(representation)
        def output = service.createRepresentationFromDescriptor(interstitial)

        then:
        assert output.mdui != null
        assert output.mdui.displayName == 'display name'
        assert output.mdui.informationUrl == 'http://example.org'
        assert output.mdui.privacyStatementUrl == 'http://example.org/privacy'
        assert output.mdui.description == 'this is a description'
        assert output.mdui.logoUrl == 'http://example.org/logo.png'
        assert output.mdui.logoHeight == 100
        assert output.mdui.logoWidth == 100
    }

    def "SHIBUI-219-1"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-219-1.json').bytes, EntityDescriptorRepresentation)
        def output = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(representation))

        then:
        assert output.serviceProviderSsoDescriptor.protocolSupportEnum == 'SAML 2'
    }

    def "SHIBUI-219-2"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-219-2.json').bytes, EntityDescriptorRepresentation)
        def output = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(representation))

        then:
        assert output.securityInfo?.authenticationRequestsSigned
    }

    def "SHIBUI-219-3"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-219-3.json').bytes, EntityDescriptorRepresentation)
        def output = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(representation))

        then:
        assert output.assertionConsumerServices.size() > 0
        assert output.assertionConsumerServices[0].binding == 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
        assert output.assertionConsumerServices[0].locationUrl == 'test'
        assert output.assertionConsumerServices[0].makeDefault
    }

    def "SHIBUI-187"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-187.json').bytes, EntityDescriptorRepresentation)
        def output = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(representation))

        then:
        assert output.assertionConsumerServices[0].binding == 'urn:oasis:names:tc:SAML:1.0:profiles:browser-post'
    }

    @Ignore
    def "payload mapping round trip: JSON->FrontendModel->BackendModel->FrontendModel->JSON"() {
        when:
        EntityDescriptorRepresentation inputRepresentation = jacksonTester.readObject('/json/SHIBUI-219-3.json')
        def actualOutputRepresentation = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(inputRepresentation))
        def actualOutputJson = jacksonTester.write(actualOutputRepresentation)

        then:
        // TODO: finish - This won't ever be identical due to transformations & null value representations
        // How about reading in an actual output json and comparing with that instead?
        // Assertions.assertThat(actualOutputJson).isEqualToJson('/json/SHIBUI-219-3.json')
        assert true
    }

    def "SHIBUI-223"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-223.json').bytes, EntityDescriptorRepresentation)
        def descriptor = service.createDescriptorFromRepresentation(representation)
        def output = service.createRepresentationFromDescriptor(descriptor)

        then:
        assert descriptor.getSPSSODescriptor('').getKeyDescriptors().size() == 1
        assert descriptor.getSPSSODescriptor('').getKeyDescriptors()[0].getUse() == null
    }

    def "updateDescriptorFromRepresentation updates descriptor properly"() {
        given:
        def randomEntityDescriptor = generateRandomEntityDescriptor()
        def updatedEntityDescriptor = generateRandomEntityDescriptor()

        //copy values we don't care about asserting (id, entity id, ...)
        updatedEntityDescriptor.entityID = randomEntityDescriptor.entityID
        updatedEntityDescriptor.resourceId = randomEntityDescriptor.resourceId
        updatedEntityDescriptor.elementLocalName = randomEntityDescriptor.elementLocalName

        def updatedEntityDescriptorRepresentation = service.createRepresentationFromDescriptor(updatedEntityDescriptor)

        when:
        service.updateDescriptorFromRepresentation(randomEntityDescriptor, updatedEntityDescriptorRepresentation)

        then:
        def expectedJson = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)
        def actualJson = mapper.writeValueAsString(service.createRepresentationFromDescriptor(randomEntityDescriptor))
        JSONAssert.assertEquals(expectedJson, actualJson, false)
    }

    def "createRepresentationFromDescriptor creates a representation containing a version that is a hash of the original object"() {
        given:
        def entityDescriptor = testObjectGenerator.buildEntityDescriptor()
        def expectedVersion = entityDescriptor.hashCode()

        when:
        def representation = service.createRepresentationFromDescriptor(entityDescriptor)

        then:
        def actualVersion = representation.version
        expectedVersion == actualVersion
    }

    def "SHIBUI-1220 getValueFromXMLObject throws RuntimeException for unhandled object type"() {
        given:
        def unhandledObject = new Object()

        when:
        service.getValueFromXMLObject(unhandledObject)

        then:
        thrown RuntimeException
    }

    def "SHIBUI-1237"() {
        given:
        // this is very inefficient, but it might work
        def inputRepresentation = new EntityDescriptorRepresentation().with {
            it.id = 'test'
            it.entityId = 'test'
            it.relyingPartyOverrides = [
                    'useSha': true,
                    'ignoreAuthenticationMethod': true
            ]
            it
        }

        when:
        def entityDescriptor = service.createDescriptorFromRepresentation(inputRepresentation)
        def representation = service.createRepresentationFromDescriptor(entityDescriptor)

        then:
        assert representation.relyingPartyOverrides.get('useSha') instanceof Boolean
        assert representation.relyingPartyOverrides.get('ignoreAuthenticationMethod') instanceof Boolean
    }

    def "SHIBUI-1522"() {
        when:
        EntityDescriptor inputEd = openSamlObjects.unmarshalFromXml this.class.getResource('/metadata/SHIBUI-1522.xml').bytes
        EntityDescriptorRepresentation edr = service.createRepresentationFromDescriptor(inputEd)
        edr.relyingPartyOverrides = [nameIdFormats: [], authenticationMethods: []]
        EntityDescriptor outputEd = service.createDescriptorFromRepresentation(edr)

        then:
        outputEd.getExtensions().unknownXMLObjects[0].attributes.size() == 0

        when:
        edr.relyingPartyOverrides = [nameIdFormats: ['format1', 'format2']]
        outputEd = service.createDescriptorFromRepresentation(edr)

        then:
        outputEd.getExtensions().unknownXMLObjects[0].attributes.size() == 1

        when:
        edr.relyingPartyOverrides = [nameIdFormats: ['format1', 'format2'], authenticationMethods: ['auth1', 'auth2']]
        outputEd = service.createDescriptorFromRepresentation(edr)

        then:
        outputEd.getExtensions().unknownXMLObjects[0].attributes.size() == 2
    }

    EntityDescriptor generateRandomEntityDescriptor() {
        EntityDescriptor ed = new EntityDescriptor()

        ed.setEntityID(generator.randomId())
        ed.setServiceProviderName(generator.randomString(10))
        ed.setServiceEnabled(generator.randomBoolean())
        ed.setResourceId(generator.randomId())
        ed.setElementLocalName(generator.randomString(10))

        //TODO: Finish fleshing out this thing

        return ed
    }

    def "SHIBUI-2830 OIDC"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-2380.json').bytes, EntityDescriptorRepresentation)
        def ed = service.createDescriptorFromRepresentation(representation)
        def oauthRpExt = (OAuthRPExtensions) ed.getSPSSODescriptor("").getExtensions().getOrderedChildren().get(0)

        then:
        assert ed.getProtocol() == EntityDescriptorProtocol.OIDC
        assert oauthRpExt.getDefaultAcrValues().size() == 2
        assert oauthRpExt.getPostLogoutRedirectUris().size() == 1
        assert oauthRpExt.getRequestUris().size() == 1
        assert oauthRpExt.getAudiences().size() == 1
        assert oauthRpExt.getClientUri().equals("https://example.org/clientUri")
        assert oauthRpExt.getResponseTypes().equals("code id_token")
        assert oauthRpExt.getSectorIdentifierUri().equals("https://example.org/sectorIdentifier")
        assert oauthRpExt.getIdTokenEncryptedResponseEnc().equals("A256GCM")
        assert oauthRpExt.getApplicationType().equals("web")
        assert oauthRpExt.getTokenEndpointAuthMethod().equals("client_secret_basic")
        assert oauthRpExt.isRequireAuthTime() == false

        assert oauthRpExt.getUserInfoEncryptedResponseEnc().equals("A192GCM")
        assert oauthRpExt.getUserInfoSignedResponseAlg().equals("RS384")
        assert oauthRpExt.getUserInfoEncryptedResponseAlg().equals("A192KW")
        assert oauthRpExt.getGrantTypes().equals("authorization_code")
        assert oauthRpExt.getSoftwareId().equals("mockSoftwareId")
        assert oauthRpExt.getRequestObjectEncryptionEnc().equals("A128GCM")
        assert oauthRpExt.getInitiateLoginUri().equals("https://example.org/initiateLogin")
        assert oauthRpExt.getTokenEndpointAuthMethod().equals("client_secret_basic")
        assert oauthRpExt.getRequestObjectSigningAlg().equals("RS256")
        assert oauthRpExt.getScopes().equals("openid profile")
        assert oauthRpExt.getIdTokenEncryptedResponseAlg().equals("A256KW")
        assert oauthRpExt.getSoftwareVersion().equals("mockSoftwareVersion")

        assert oauthRpExt.getDefaultMaxAge() == 0
    }

    def "SHIBUI-1723"() {
        given:
        def entityDescriptor = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-1723-1.xml').bytes) as EntityDescriptor
        entityDescriptor.idOfOwner = "foo"

        def entityDescriptorRepresentation = service.createRepresentationFromDescriptor(entityDescriptor).with {
            it.serviceProviderName = 'testme'
            it.contacts = []
            it.securityInfo.keyDescriptors[0].name = 'testcert'
            it.createdBy = 'root'
            it.setCreatedDate(LocalDateTime.now())
            it.setModifiedDate(LocalDateTime.now())
            it
        }
        def json = mapper.writeValueAsString(entityDescriptorRepresentation)
        HashMap<String, JsonSchemaResourceLocation> schemaLocations = new HashMap<>()
        def jsonSchemaResourceLocationRegistry = new JsonSchemaComponentsConfiguration().jsonSchemaResourceLocationRegistry(new DefaultResourceLoader(), this.mapper)
        schemaLocations.put("SAML", metadataSourcesSAMLSchema(jsonSchemaResourceLocationRegistry))
        schemaLocations.put("OIDC", metadataSourcesOIDCSchema(jsonSchemaResourceLocationRegistry))

        when:
        LowLevelJsonSchemaValidator.validateMetadataSourcePayloadAgainstSchema(new MockHttpInputMessage(json.bytes), schemaLocations)

        then:
        noExceptionThrown()
    }

    @WithMockUser(value = "bbUser", roles = ["USER"])
    def "get list of entity descriptors that a group can approve"() {
        when:
        def ed = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-553.2.xml').bytes) as EntityDescriptor
        ed.with {
            it.idOfOwner = 'AAA' // BBB can approve
            it.enabled = false
            it
        }
        entityDescriptorRepository.save(ed)
        def ed2 = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-1772.xml').bytes) as EntityDescriptor
        ed2.with {
            it.idOfOwner = 'CCC' // BBB can not approve
            it.enabled = false
            it
        }
        entityDescriptorRepository.save(ed2)

        entityManager.flush()
        entityManager.clear()

        then:
        def result =  service.getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess()
        result.size() == 1

        when:
        service.changeApproveStatusOfEntityDescriptor(result.get(0).getResourceId(), true);

        then:
        def result2 =  service.getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess()
        result2.isEmpty() == true
    }
}