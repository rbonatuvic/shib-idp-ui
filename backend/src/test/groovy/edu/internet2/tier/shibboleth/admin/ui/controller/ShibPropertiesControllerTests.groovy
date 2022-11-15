package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySetting
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound
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

import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
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
            it.displayType = 'string'

            it
        }
        ShibPropertySetting prop1Saved = propertySettingRepo.save(prop1)
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'foo2'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'bar2'
            it.displayType = 'string'

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
            e instanceof PersistentEntityNotFound
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
            e instanceof PersistentEntityNotFound
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
            it.displayType = 'boolean'

            it
        }
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'food2.for2.thought'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'
            it.displayType = 'boolean'

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

    @WithMockAdmin
    def "PUT /api/shib/property/set update set that doesn't exist"() {
        when:
        ShibPropertySet set = propertySetRepo.findByResourceId(defaultSetResourceId)
        set.resourceId = 1234
        def jsonBody = mapper.writeValueAsString(set)

        then:
        try {
            mockMvc.perform(put('/api/shib/property/set/1234').contentType(APPLICATION_JSON).content(jsonBody))
        }
        catch (Exception e) {
            e instanceof PersistentEntityNotFound
        }
    }

    @WithMockAdmin
    def "PUT /api/shib/property/set update set"() {
        when:
        ShibPropertySet set = propertySetRepo.findByResourceId(defaultSetResourceId)
        set.name = "newName"
        def jsonBody = mapper.writeValueAsString(set)
        def url = "/api/shib/property/set/{resourceId}"
        def result = mockMvc.perform(put(url, defaultSetResourceId).contentType(APPLICATION_JSON).content(jsonBody))

        then:
        result.andExpect(status().isOk()).andExpect(jsonPath("\$.name").value("newName"))
        propertySetRepo.findByResourceId(defaultSetResourceId).name.equals("newName")
    }

    @WithMockAdmin
    def "Validate that JSON data is correct for UI"() {
        given:
        ShibPropertySetting prop = new ShibPropertySetting().with { it ->
            it.propertyName = 'asBoolean'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'
            it.displayType = 'boolean'

            it
        }
        propertySettingRepo.save(prop)
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'asNumber'
            it.configFile = 'defaults.properties'
            it.propertyValue = '33'
            it.displayType = 'number'

            it
        }
        propertySettingRepo.save(prop2)
        ShibPropertySetting prop3 = new ShibPropertySetting().with { it ->
            it.propertyName = 'anythingElse'
            it.configFile = 'defaults.properties'
            it.propertyValue = '33'
            it.displayType = 'string'

            it
        }
        propertySettingRepo.save(prop3)
        ShibPropertySet set = new ShibPropertySet().with {it ->
            it.properties.add(prop)
            it.properties.add(prop2)
            it.properties.add(prop3)
            it.name = 'somerandom'

            it
        }
        def savedSet = propertySetRepo.save(set)
        entityManager.flush()
        entityManager.clear()

        when:
        def result = mockMvc.perform(get("/api/shib/property/set/" + savedSet.getResourceId()))
        System.println(result.andReturn().getResponse().getContentAsString())
        then:
        result.andExpect(status().isOk())
                .andExpect(jsonPath("\$.resourceId").value(savedSet.getResourceId()))
                .andExpect(jsonPath("\$.properties[0].propertyName").value("asBoolean"))
                .andExpect(jsonPath("\$.properties[0].propertyValue").value(Boolean.TRUE))
                .andExpect(jsonPath("\$.properties[1].propertyName").value("asNumber"))
                .andExpect(jsonPath("\$.properties[1].propertyValue").value(33))
                .andExpect(jsonPath("\$.properties[2].propertyName").value("anythingElse"))
                .andExpect(jsonPath("\$.properties[2].propertyValue").value("33"))
    }
}