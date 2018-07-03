package edu.internet2.tier.shibboleth.admin.ui.controller

import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
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
        @Bean
        MetadataResolver metadataResolver() {
            new FilesystemMetadataResolver(new File('fake'))
        }
    }
}
