package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySetting
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibPropertySetRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibPropertySettingRepository
import edu.internet2.tier.shibboleth.admin.ui.service.ShibConfigurationService
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.client.RestTemplate
import spock.lang.Subject

import javax.persistence.EntityManager
import javax.transaction.Transactional

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class ShibPropertiesControllerTests  extends AbstractBaseDataJpaTest {
    @Subject
    def controller

    @Autowired
    ObjectMapper mapper

    @Autowired
    EntityManager entityManager

    @Autowired
    ShibPropertySetRepository propertySetRepo

    @Autowired
    ShibPropertySettingRepository propertySettingRepo

    @Autowired
    ShibConfigurationService shibConfigurationService

    def defaultSetResourceId
    def mockRestTemplate = Mock(RestTemplate)
    def mockMvc

    @Transactional
    def setup() {
        controller = new ShibPropertiesController()
        controller.service = shibConfigurationService
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        ShibPropertySetting prop1 = new ShibPropertySetting().with { it ->
            it.propertyName = 'foo'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'bar'

            it
        }
        ShibPropertySetting prop1Saved = propertySettingRepo.save(prop1)
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'foo2'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'bar2'

            it
        }
        ShibPropertySetting prop2Saved = propertySettingRepo.save(prop2)
        entityManager.flush()
        entityManager.clear()

        ArrayList<ShibPropertySetting> values = new ArrayList<>()
        values.add(prop1Saved)
        values.add(prop2Saved)
        def set = new ShibPropertySet()
        set.setName("set1")
        set.setProperties(values)
        def savedSet = propertySetRepo.save(set)
        entityManager.flush()
        entityManager.clear()

        defaultSetResourceId = savedSet.resourceId
    }

    @WithMockAdmin
    def "DELETE /api/shib/property/set"() {
        given:
        def long setCount = propertySetRepo.count()
        def long propsCount = propertySettingRepo.count()

        expect:
        setCount == 1
        propsCount == 2

        try {
            mockMvc.perform(delete("/api/shib/property/set/010"))
        }
        catch (Exception e) {
            e instanceof EntityNotFoundException
        }

        when:
        def result = mockMvc.perform(delete("/api/shib/property/set/" + defaultSetResourceId))

        then:
        result.andExpect(status().isNoContent())
        propertySetRepo.count() == 0
        propertySettingRepo.count() == 0


    }

    @WithMockAdmin
    def 'GET /api/shib/property/set/{resourceId} non-existent'() {
        expect:
        try {
            mockMvc.perform(get("/api/shib/property/set/0101"))
        }
        catch (Exception e) {
            e instanceof EntityNotFoundException
        }
    }

    @WithMockAdmin
    def "POST /api/shib/property/set - existing set"() {
        given:
        def jsonBody = mapper.writeValueAsString(propertySetRepo.findByResourceId(defaultSetResourceId))

        expect:
        try {
            mockMvc.perform(post('/api/shib/property/set').contentType(APPLICATION_JSON).content(jsonBody))
        }
        catch (Exception e) {
            e instanceof ObjectIdExistsException
        }
    }

    @WithMockAdmin
    def "POST /api/shib/property/set - new set"() {
        when:
        ShibPropertySetting prop = new ShibPropertySetting().with { it ->
            it.propertyName = 'food.for.thought'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'

            it
        }
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'food2.for2.thought'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'

            it
        }
        ShibPropertySet set = new ShibPropertySet().with {it ->
            it.properties.add(prop)
            it.properties.add(prop2)
            it.name = 'somerandom'

            it
        }

        def jsonBody = mapper.writeValueAsString(set)
        def result = mockMvc.perform(post('/api/shib/property/set').contentType(APPLICATION_JSON).content(jsonBody))

        then:
        result.andExpect(status().isCreated()).andExpect(jsonPath("\$.name").value("somerandom"))
        def createdSet = propertySetRepo.findByName("somerandom")
        createdSet.getProperties().size() == 2
    }
}