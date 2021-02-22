package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import groovy.json.JsonOutput
import net.shibboleth.ext.spring.resource.ResourceHelper
import org.joda.time.DateTime
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.util.DefaultUriBuilderFactory
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import org.xmlunit.diff.DefaultNodeMatcher
import org.xmlunit.diff.ElementSelectors
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("no-auth")
class EntitiesControllerIntegrationTests extends Specification {

    @Autowired
    private WebTestClient webClient

    /*def setup() {
        //DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory()
        //factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE)

        // yeah, don't ask... this is just shenanigans
        this.webClient = WebTestClient.builder().uriBuilderFactory(factory).build()
        this.webClient.webClient.uriBuilderFactory.encodingMode = DefaultUriBuilderFactory.EncodingMode.NONE
    }*/

    def "GET /api/entities returns the proper json"() {
        given:
        def expectedBody = '''
            {               
                "entityId":"http://test.scaldingspoon.org/test1",                
                "serviceProviderSsoDescriptor": {
                    "protocolSupportEnum":"SAML 2",
                    "nameIdFormats":["urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"]
                },                
                "assertionConsumerServices":[
                    {"locationUrl":"https://test.scaldingspoon.org/test1/acs","binding":"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST","makeDefault":false}
                ],
                "serviceEnabled":false,                
                "relyingPartyOverrides":{},
                "attributeRelease":["givenName","employeeNumber"]
            }
        '''

        when:
        def result = this.webClient
                .get()
                .uri("/api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1")
                .exchange() // someday, I'd like to know why IntelliJ "cannot resolve symbol 'exchange'"

        then:
        result.expectStatus().isOk()
                .expectBody()
                .json(expectedBody)
    }

    def "GET /api/entities/test is not found"() {
        when:
        def result = this.webClient
                .get()
                .uri("/api/entities/test")
                .exchange()

        then:
        result.expectStatus().isNotFound()
    }

    def "GET /api/entities/test XML is not found"() {
        when:
        def result = this.webClient
                .get()
                .uri("/api/entities/test")
                .header('Accept', 'application/xml')
                .exchange()

        then:
        result.expectStatus().isNotFound()
    }

    def "GET /api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1 XML returns proper XML"() {
        given:
        def expectedBody = '''<?xml version="1.0" encoding="UTF-8"?>
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
    </mdattr:EntityAttributes>
  </md:Extensions>
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        when:
        def result = this.webClient
                .get()
                .uri("/api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1")
                .header('Accept', 'application/xml')
                .exchange()

        then:
        def resultBody = result.expectStatus().isOk()
                //.expectHeader().contentType("application/xml;charset=ISO-8859-1") // should this really be ISO-8859-1?
                                                                                    // expectedBody encoding is UTF-8...
                .expectHeader().contentType("application/xml;charset=UTF-8")
                .expectBody(String.class)
                .returnResult()
        def diff = DiffBuilder.compare(Input.fromString(expectedBody)).withTest(Input.fromString(resultBody.getResponseBody())).ignoreComments().checkForSimilar().ignoreWhitespace().withNodeMatcher(new DefaultNodeMatcher(ElementSelectors.byNameAndText)).build()
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
