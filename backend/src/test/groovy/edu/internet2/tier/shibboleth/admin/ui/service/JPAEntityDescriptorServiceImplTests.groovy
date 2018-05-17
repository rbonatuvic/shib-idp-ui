package edu.internet2.tier.shibboleth.admin.ui.service

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.XSAny
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.springframework.boot.test.json.JacksonTester
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import org.xmlunit.diff.DefaultNodeMatcher
import org.xmlunit.diff.ElementSelectors
import spock.lang.Specification

class JPAEntityDescriptorServiceImplTests extends Specification {

    def testObjectGenerator

    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects))

    JacksonTester<EntityDescriptorRepresentation> jacksonTester

    RandomGenerator generator

    def setup() {
        JacksonTester.initFields(this, new ObjectMapper())
        generator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator()
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
                it.x509CertificateAvailable = true
                it.x509Certificates = [new SecurityInfoRepresentation.X509CertificateRepresentation().with {
                    it.type = 'signing'
                    it.value = 'certificate'
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
                it.x509CertificateAvailable = true
                it.x509Certificates = [new SecurityInfoRepresentation.X509CertificateRepresentation().with {
                    it.type = 'encryption'
                    it.value = 'certificate'
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
                it.x509CertificateAvailable = true
                it.x509Certificates = [new SecurityInfoRepresentation.X509CertificateRepresentation().with {
                    it.type = 'both'
                    it.value = 'certificate'
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
                        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.example.org/SAML/POST"/>
                        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://test.example.org/SAML/GET" isDefault="true"/>
                     </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        def test = openSamlObjects.marshalToXmlString(service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.assertionConsumerServices = [
                    new AssertionConsumerServiceRepresentation().with {
                        it.binding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
                        it.locationUrl = 'https://test.example.org/SAML/POST'
                        it
                    },
                    new AssertionConsumerServiceRepresentation().with {
                        it.binding = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'
                        it.locationUrl = 'https://test.example.org/SAML/GET'
                        it.makeDefault = true
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
        assert output.securityInfo?.authenticationRequestsSigned == true
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

    def "payload mapping round trip: JSON->FrontendModel->BackendModel->FrontendModel->JSON"() {
        when:
        EntityDescriptorRepresentation inputRepresentation = jacksonTester.readObject('/json/SHIBUI-219-3.json')
        def actualOutputRepresentation = service.createRepresentationFromDescriptor(service.createDescriptorFromRepresentation(inputRepresentation))
        def actualOutputJson = jacksonTester.write(actualOutputRepresentation)

        then:
        // TODO: finish
        // Assertions.assertThat(actualOutputJson).isEqualToJson('/json/SHIBUI-219-3.json')
        assert true
    }

    def "SHIBUI-223"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-223.json').bytes, EntityDescriptorRepresentation)
        def descriptor = service.createDescriptorFromRepresentation(representation)
        def output = service.createRepresentationFromDescriptor(descriptor)

        then:
        assert output.securityInfo.x509Certificates.size() == 1
        assert output.securityInfo.x509Certificates[0].type == 'both'

        assert descriptor.getSPSSODescriptor('').getKeyDescriptors().size() == 1
        assert descriptor.getSPSSODescriptor('').getKeyDescriptors()[0].getUse() == null
    }

    def "createAttributeWithBooleanValue properly adds booleans to attributes"() {
        given:
        def expectedName = "someName"
        def expectedFriendlyName = "someFriendlyName"
        def randomBoolean = generator.randomBoolean()

        when:
        def attribute = service.createAttributeWithBooleanValue(expectedName, expectedFriendlyName, randomBoolean)

        then:
        expectedName == attribute.getName()
        expectedFriendlyName == attribute.getFriendlyName()
        attribute.getAttributeValues().size() == 1
        attribute.getAttributeValues().get(0) instanceof XSBoolean
        Boolean.parseBoolean(((XSBoolean)attribute.getAttributeValues().get(0)).getStoredValue()) == randomBoolean

        where:
        i << (1..5)
    }

    def "createAttributeWithArbitraryValues properly adds additional attributes"() {
        given:
        def expectedName = "someName"
        def expectedFriendlyName = "someFriendlyName"
        def attributesArray = []
        for (int index = 0; index < testRunIndex; index++) {
            attributesArray.add("additionalAttributes" + index)
        }


        when:
        def attribute = service.createAttributeWithArbitraryValues(expectedName,
                expectedFriendlyName,
                attributesArray)

        then:
        expectedName == attribute.getName()
        expectedFriendlyName == attribute.getFriendlyName()
        attribute.getAttributeValues().size() == testRunIndex
        for (int index = 0; index < testRunIndex; index++) {
            attribute.getAttributeValues().get(index) instanceof XSAny
            ((XSAny)attribute.getAttributeValues().get(index)).getTextContent() == "additionalAttributes" + index
        }

        where:
        testRunIndex << (1..5)
    }

    def "createAttributeWithArbitraryValues adds no attributes when passed no attributes"() {
        given:
        def expectedName = "someName"
        def expectedFriendlyName = "someFriendlyName"

        when:
        def attribute = service.createAttributeWithArbitraryValues(expectedName, expectedFriendlyName)

        then:
        expectedName == attribute.getName()
        expectedFriendlyName == attribute.getFriendlyName()
        attribute.getAttributeValues().size() == 0
    }

    def "createAttributeWithArbitraryValues doesn't explode when passed a list of strings"() {
        given:
        def expectedName = "someName"
        def expectedFriendlyName = "someFriendlyName"
        List<String> attributesList = new ArrayList<String>()
        for (int index = 0; index < testRunIndex; index++) {
            attributesList.add("additionalAttributes" + index)
        }

        when:
        def attribute = service.createAttributeWithArbitraryValues(expectedName,
                expectedFriendlyName,
                attributesList)

        then:
        expectedName == attribute.getName()
        expectedFriendlyName == attribute.getFriendlyName()
        attribute.getAttributeValues().size() == testRunIndex
        for (int index = 0; index < testRunIndex; index++) {
            attribute.getAttributeValues().get(index) instanceof XSAny
            ((XSAny)attribute.getAttributeValues().get(index)).getTextContent() == "additionalAttributes" + index
        }

        where:
        testRunIndex << (1..5)
    }

    def "updateDescriptorFromRepresentation throws expected exception"() {
        given:
        def randomEntityDescriptor = generateRandomEntityDescriptor()
        def entityDescriptorRepresentation = service.createRepresentationFromDescriptor(randomEntityDescriptor)

        when:
        service.updateDescriptorFromRepresentation(randomEntityDescriptor, entityDescriptorRepresentation)

        then:
        thrown UnsupportedOperationException
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

    EntityDescriptor generateRandomEntityDescriptor() {
        EntityDescriptor ed = new EntityDescriptor()

        ed.setEntityID(generator.randomId())
        ed.setServiceProviderName(generator.randomString(10))
        ed.setServiceEnabled(generator.randomBoolean())
        ed.setResourceId(generator.randomId())

        return ed
    }
}
