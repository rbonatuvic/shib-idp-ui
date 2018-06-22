package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles

import spock.lang.Specification

import javax.persistence.EntityManager

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("no-auth")
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class MetadataResolversControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityManager entityManager

    ObjectMapper mapper

    def setup() {
        mapper = new ObjectMapper()
        mapper.registerModule(new JavaTimeModule())
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
    }

    def "GET empty /api/MetadataResolvers"() {
        when:
        def result = this.restTemplate.getForEntity("/api/MetadataResolvers", String)
        def returnedResolvers = mapper.readValue(result.body,
                edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver[])

        then:
        result.statusCodeValue == 200
        returnedResolvers.size() == 0
    }

    def "GET one DynamicHttpMetadataResolver /api/MetadataResolvers"() {
        given:
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
        }
        metadataResolverRepository.save(resolver)

        when:
        def result = this.restTemplate.getForEntity("/api/MetadataResolvers", String)
        def returnedResolvers = mapper.readValue(result.body,
                edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver[])

        then:
        result.statusCodeValue == 200
        returnedResolvers.size() == 1
        returnedResolvers[0] instanceof DynamicHttpMetadataResolver
    }

    @TestConfiguration
    static class Config {
        @Bean
        MetadataResolver metadataResolver() {
            new FilesystemMetadataResolver(new File('fake'))
        }
    }
}
