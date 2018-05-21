package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import net.shibboleth.ext.spring.resource.ResourceHelper
import org.joda.time.DateTime
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.util.DefaultUriBuilderFactory
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("default")
class DefaultAuthenticationIntegrationTests extends Specification {

    @Autowired
    private WebTestClient webClient

    def setup() {
        this.webClient.webClient.uriBuilderFactory.encodingMode = DefaultUriBuilderFactory.EncodingMode.NONE
    }

    def "When auth is enabled and an unauth'd request is made, a 302 is returned which points at login"() {
        when:
        def result = this.webClient
                .get()
                .uri("/api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1")
                .exchange()

        then:
        result
                .expectStatus().isEqualTo(302)
                .expectHeader().valueMatches("Location", "http://localhost:\\d*/login")
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
