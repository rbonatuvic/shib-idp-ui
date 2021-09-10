package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.MapperFeature
import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle
import edu.internet2.tier.shibboleth.admin.ui.repository.AttributeBundleRepository
import edu.internet2.tier.shibboleth.admin.ui.service.AttributeBundleService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import static org.hamcrest.Matchers.containsInAnyOrder
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@DataJpaTest
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ContextConfiguration(classes = [ShibUIConfiguration, ABCTConfig])
class AttributeBundleControllerTests extends Specification {
    @Autowired
    AttributeBundleController controller

    @Autowired
    AttributeBundleRepository attributeBundleRepository

    ObjectMapper objectMapper = new ObjectMapper().with {
        it.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
        it
    }

    def MockMvc

    @Transactional
    def setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
        attributeBundleRepository.deleteAll()
    }

    def "GET checks" () {
        expect:
        attributeBundleRepository.findAll().isEmpty()

        when: "fetch for no bundles"
        def result = mockMvc.perform(get('/api/custom/entity/bundles'))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(content().json('[]'))

        when: "add a bundle"
        def json = """            
              {
	            "name": "bundleName",
	            "resourceId": "randomIDVal",
	            "attributes": ["eduPersonPrincipalName", "surname", "givenName"]
              }                
        """

        AttributeBundle bundle = objectMapper.readValue(json, AttributeBundle.class)
        attributeBundleRepository.saveAndFlush(bundle)
        result = mockMvc.perform(get('/api/custom/entity/bundles'))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$.[0].name").value("bundleName"))
                .andExpect(jsonPath("\$.[0].resourceId").value("randomIDVal"))
                .andExpect(jsonPath("\$.[0].attributes", containsInAnyOrder("eduPersonPrincipalName", "surname", "givenName")))
    }

    // can go away with merge to develop...
    @TestConfiguration
    private static class ABCTConfig {
        @Bean
        AttributeBundleController attributeBundleController(AttributeBundleService attributeBundleService) {
            new AttributeBundleController().with {
                it.attributeBundleService = attributeBundleService
                it
            }
        }

        @Bean
        AttributeBundleService attributeBundleService(AttributeBundleRepository repo) {
            new AttributeBundleService().with {
                it.attributeBundleRepository = repo
                it
            }
        }

    }
}