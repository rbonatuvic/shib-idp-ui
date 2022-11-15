package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound
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
import org.springframework.web.util.NestedServletException
import spock.lang.Specification

import static org.hamcrest.Matchers.containsInAnyOrder
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@DataJpaTest(properties = ["spring.jackson.mapper.accept-case-insensitive-enums=true"])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ContextConfiguration(classes = [ShibUIConfiguration, ABCTConfig])
class AttributeBundleControllerTests extends Specification {
    @Autowired
    AttributeBundleController controller

    @Autowired
    AttributeBundleRepository attributeBundleRepository

    ObjectMapper objectMapper = new ObjectMapper()

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

    def "CREATE checks" () {
        expect:
        attributeBundleRepository.findAll().isEmpty()

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

        then: "bundle already exists"
        try {
            mockMvc.perform(post('/api/custom/entity/bundles').contentType(APPLICATION_JSON).content(json))
            false
        } catch (NestedServletException expected) {
            expected.getCause() instanceof ObjectIdExistsException
        }

        when: "new bundle"
        json = """            
              {
	            "name": "bundle2",
	            "resourceId": "differentResourceId",
	            "attributes": ["eduPersonPrincipalName", "surname", "givenName"]
              }                
        """

        def result = mockMvc.perform(post('/api/custom/entity/bundles').contentType(APPLICATION_JSON).content(json))
        then:
             result.andExpect(status().isCreated())
                   .andExpect(content().contentType(APPLICATION_JSON))
                   .andExpect(jsonPath("\$.name").value("bundle2"))
                   .andExpect(jsonPath("\$.resourceId").value("differentResourceId"))
                   .andExpect(jsonPath("\$.attributes", containsInAnyOrder("eduPersonPrincipalName", "surname", "givenName")))
    }

    def "test delete" () {
        expect:
        attributeBundleRepository.findAll().isEmpty()

        when:
        def json = """            
              {
	            "name": "bundleName",
	            "resourceId": "randomIDVal",
	            "attributes": ["eduPersonPrincipalName", "surname", "givenName"]
              }                
        """
        AttributeBundle bundle = objectMapper.readValue(json, AttributeBundle.class)
        attributeBundleRepository.save(bundle)

        then:
        attributeBundleRepository.findAll().size() == 1

        // Delete something doesn't exist
        try {
            mockMvc.perform(delete("/api/custom/entity/bundles/randomIDValdoesntexist"))
            false
        } catch (NestedServletException expected) {
            expected instanceof PersistentEntityNotFound
        }

        when: "Delete what does exist"
        def result = mockMvc.perform(delete("/api/custom/entity/bundles/randomIDVal"))

        then:
        result.andExpect(status().isNoContent())
        attributeBundleRepository.findAll().isEmpty()
    }

    def "Update checks" () {
        expect:
        attributeBundleRepository.findAll().isEmpty()

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

        then: "bundle doesn't exist"
        bundle.setResourceId("foo")
        try {
            mockMvc.perform(put('/api/custom/entity/bundles').contentType(APPLICATION_JSON).content(objectMapper.writeValueAsString(bundle)))
            false
        } catch (NestedServletException expected) {
            expected.getCause() instanceof PersistentEntityNotFound
        }

        when: "update bundle"
        json = """            
              {
	            "name": "bundle2",
	            "resourceId": "randomIDVal",
	            "attributes": ["eduPersonUniqueId", "employeeNumber", "givenName"]
              }                
        """

        def result = mockMvc.perform(put('/api/custom/entity/bundles').contentType(APPLICATION_JSON).content(json))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$.name").value("bundle2"))
                .andExpect(jsonPath("\$.resourceId").value("randomIDVal"))
                .andExpect(jsonPath("\$.attributes", containsInAnyOrder("eduPersonUniqueId", "employeeNumber", "givenName")))
    }

    // can go away with merge to develop and this extends the base test class
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