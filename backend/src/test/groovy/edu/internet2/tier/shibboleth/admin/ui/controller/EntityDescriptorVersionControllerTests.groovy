package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.Organization
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationDisplayName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationURL
import edu.internet2.tier.shibboleth.admin.ui.envers.EnversVersionServiceSupport
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.service.EnversEntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.EnversMetadataResolverVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import spock.lang.Subject

import javax.persistence.EntityManager

import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@ContextConfiguration(classes=[EDCLocalConfig])
class EntityDescriptorVersionControllerTests extends AbstractBaseDataJpaTest {
    @Autowired
    private TestEntityManager testEntityManager

    @Autowired
    EntityService entityService

    @Autowired
    JPAEntityDescriptorServiceImpl jpaEntityDescriptorService

    @Autowired
    ObjectMapper mapper

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    EntityDescriptorVersionService versionService

    def mockMvc
    def mockRestTemplate = Mock(RestTemplate)
    def resId

    @Subject
    def controller

    @Transactional
    def setup() {
        openSamlObjects.init()

        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb.setValidationRegex("/^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$/")
        gb = groupService.createGroup(gb)

        controller = new EntityDescriptorController(versionService)
        controller.openSamlObjects = openSamlObjects
        controller.entityDescriptorService = jpaEntityDescriptorService
        controller.restTemplate = mockRestTemplate

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        userService.save(user)

        EntityDescriptorConversionUtils.setOpenSamlObjects(openSamlObjects)
        EntityDescriptorConversionUtils.setEntityService(entityService)

        // Because the audit is done with hibernate envers (which is done by a listener after a transaction commit), we have to jump
        // through some hoops to get this to work like it should in this DataJPATest
        // Use the TestEntityManager to get the versions saved to the db
        EntityDescriptor ed = new EntityDescriptor(entityID: 'testme', serviceProviderName: 'testme').with {
            entityDescriptorRepository.saveAndFlush(it)
        }
        testEntityManager.getEntityManager().getTransaction().commit() // get envers to write version
        resId = ed.resourceId
        ed = entityDescriptorRepository.findByResourceId(resId)

        testEntityManager.getEntityManager().getTransaction().begin()
        ed.setOrganization(new Organization().with {
            it.organizationNames = [new OrganizationName(value: 'testme', XMLLang: 'en')]
            it.organizationDisplayNames = [new OrganizationDisplayName(value: 'testme', XMLLang: 'en')]
            it.organizationURLs = [new OrganizationURL(value: 'http://testme.org', XMLLang: 'en')]
            it
        })
        entityDescriptorRepository.saveAndFlush(ed)
        testEntityManager.getEntityManager().getTransaction().commit() // get envers to write version
        testEntityManager.getEntityManager().clear()
    }

    /**
     *
     * - No @Transactional on the method
     * -
     */
    @WithMockAdmin
    @Transactional
    def 'SHIBUI-1414'() {
        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/" + resId + "/Versions"))
        def allVersions = mapper.readValue(result.andReturn().getResponse().getContentAsString(), List.class)

        String edv1 = mockMvc.perform(get("/api/EntityDescriptor/" + resId + "/Versions/" + allVersions.get(0).id)).andReturn().getResponse().getContentAsString()
        String edv2 = mockMvc.perform(get("/api/EntityDescriptor/" + resId + "/Versions/" + allVersions.get(1).id)).andReturn().getResponse().getContentAsString()

        def v2Version = new JsonSlurper().parseText(edv2).get("version")
        def aedv1 = new JsonSlurper().parseText(edv1).with {
            it.put('version', v2Version)
            it
        }.with {
            JsonOutput.toJson(it)
        }
        testEntityManager.getEntityManager().getTransaction().begin()
        def response = mockMvc.perform(put("/api/EntityDescriptor/" + resId).contentType(APPLICATION_JSON).content(aedv1))
        testEntityManager.getEntityManager().getTransaction().commit()

        then:
        response.andExpect(status().isOk())
        noExceptionThrown()
    }

    @TestConfiguration
    private static class EDCLocalConfig {
        @Bean
        EntityDescriptorVersionService entityDescriptorVersionService(EnversVersionServiceSupport support, EntityDescriptorService entityDescriptorService) {
            return new EnversEntityDescriptorVersionService(support, entityDescriptorService)
        }

        @Bean
        MetadataResolverVersionService metadataResolverVersionService(EnversVersionServiceSupport support) {
            return new EnversMetadataResolverVersionService(support)
        }

        @Bean
        EnversVersionServiceSupport enversVersionServiceSupport(EntityManager entityManager) {
            return new EnversVersionServiceSupport(entityManager)
        }
    }
}