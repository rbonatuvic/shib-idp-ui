package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestHelpers
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class JPAEntityServiceImplTests extends Specification {

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    AttributeUtility attributeUtility;

    def randomGenerator
    def testObjectGenerator

    def service

    def setup() {
        service = new JPAEntityServiceImpl(openSamlObjects)
        service.attributeUtility = attributeUtility

        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator(attributeUtility)
    }

    def "getAttributeListFromEntityRepresentation builds an appropriate attribute list"() {
        given:
        def representation = new EntityDescriptorRepresentation()
        representation.setAttributeRelease(randomGenerator.randomStringList())
        representation.setRelyingPartyOverrides(testObjectGenerator.buildRelyingPartyOverridesRepresentation())

        when:
        def result = service.getAttributeListFromEntityRepresentation(representation)

        then:
        //TODO: Similar to JPAFilterServiceImplTests, should we do a more thorough test or is checking the count sufficient?
        result.size == 1 + TestHelpers.determineCountOfAttributesFromRelyingPartyOverrides(representation.getRelyingPartyOverrides())
    }

    def "getAttributeFromAttributeReleaseList builds an attribute properly"() {
        given:
        def listOfStrings = randomGenerator.randomStringList()

        def expectedAttributeName = MDDCConstants.RELEASE_ATTRIBUTES
        def expectedNamespaceURI = "urn:oasis:names:tc:SAML:2.0:assertion"
        def expectedElementLocalName = "AttributeValue"
        def expectedNamespacePrefix = "saml2"
        def expectedSchemaTypeNamespaceURI= "http://www.w3.org/2001/XMLSchema"
        def expectedSchemaTypeElementLocalName = "string"
        def expectedSchemaTypeNamespacePrefix = "xsd"

        when:
        def result = service.getAttributeFromAttributeReleaseList(listOfStrings)

        then:
        result.name == expectedAttributeName
        result.attributeValues.size == listOfStrings.size
        result.attributeValues.each {
            listOfStrings.contains(it.value)
            it.namespaceURI == expectedNamespaceURI
            it.elementLocalName == expectedElementLocalName
            it.namespacePrefix == expectedNamespacePrefix
            it.schemaTypeNamespaceURI == expectedSchemaTypeNamespaceURI
            it.schemaTypeElementLocalName == expectedSchemaTypeElementLocalName
            it.schemaTypeNamespacePrefix == expectedSchemaTypeNamespacePrefix
        }
    }
}
