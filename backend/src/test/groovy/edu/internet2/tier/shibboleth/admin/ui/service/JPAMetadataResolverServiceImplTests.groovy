package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import net.shibboleth.ext.spring.resource.ResourceHelper
import net.shibboleth.utilities.java.support.resolver.CriteriaSet
import org.joda.time.DateTime
import org.opensaml.core.criterion.EntityIdCriterion
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import spock.lang.Specification

@SpringBootTest
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class JPAMetadataResolverServiceImplTests extends Specification {
    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    MetadataResolverService metadataResolverService

    @Autowired
    MetadataResolver metadataResolver

    @Autowired
    EntityService entityService

    @Autowired
    OpenSamlObjects openSamlObjects

    def 'test adding a filter'() {
        given:
        def expectedXML = '''<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
  <md:Extensions>
    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>internal</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>givenName</saml:AttributeValue>
        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
      </saml:Attribute>
      <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues">
        <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:string">testme</saml2:AttributeValue>
      </saml2:Attribute>
    </mdattr:EntityAttributes>
  </md:Extensions>
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>'''
        when:
        def mdr = new edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver().with {
            it.name = "testme"
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.setValue(['http://test.scaldingspoon.org/test1'])
                    return it
                }
                it.attributes = entityService.getAttributeListFromAttributeReleaseList(['testme'])
                return it
            })
            return it
        }
        metadataResolverRepository.save(mdr)
        metadataResolverService.reloadFilters("testme")

        then:
        assert metadataResolverRepository.findAll().size() > 0
        def ed = metadataResolver.resolveSingle(new CriteriaSet(new EntityIdCriterion('http://test.scaldingspoon.org/test1')))
        def resultString = openSamlObjects.marshalToXmlString(ed)
        def diff = DiffBuilder.compare(Input.fromString(expectedXML)).withTest(Input.fromString(resultString)).ignoreComments().ignoreWhitespace().build()
        !diff.hasDifferences()
    }

    @TestConfiguration
    static class Config {
        @Autowired
        OpenSamlObjects openSamlObjects

        @Bean
        MetadataResolver metadataResolver() {
            def resource = ResourceHelper.of(new ClassPathResource("/metadata/aggregate.xml"))
            def aggregate = new ResourceBackedMetadataResolver(resource){
                @Override
                DateTime getLastRefresh() {
                    return null
                }
            }

            aggregate.with {
                it.metadataFilter = new MetadataFilterChain()
                it.id = 'testme'
                it.parserPool = openSamlObjects.parserPool
                it.initialize()
                it
            }

            return new ChainingMetadataResolver().with {
                it.id = 'chain'
                it.resolvers = [aggregate]
                it.initialize()
                it
            }
        }
    }
}
