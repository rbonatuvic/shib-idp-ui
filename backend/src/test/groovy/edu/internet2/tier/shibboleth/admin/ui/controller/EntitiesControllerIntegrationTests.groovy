package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import spock.lang.Subject

import javax.persistence.EntityManager

import static org.springframework.http.MediaType.APPLICATION_XML
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class EntitiesControllerIntegrationTests  extends AbstractBaseDataJpaTest {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityService entityService

    @Autowired
    TestObjectGenerator generator

    @Autowired
    ObjectMapper mapper

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    JPAEntityDescriptorServiceImpl jpaEntityDescriptorService

    RandomGenerator randomGenerator
    def mockRestTemplate = Mock(RestTemplate)
    def mockMvc

    @Subject
    def controller

    EntityDescriptorVersionService versionService = Mock()

    @Transactional
    def setup() {
        openSamlObjects.init()

        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb.setValidationRegex("^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$")
        gb = groupService.createGroup(gb)

        randomGenerator = new RandomGenerator()

        controller = new EntitiesController()
        controller.openSamlObjects = openSamlObjects
        controller.entityDescriptorService = jpaEntityDescriptorService
        controller.entityDescriptorRepository = entityDescriptorRepository

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        userService.save(user)

        EntityDescriptorConversionUtils.setOpenSamlObjects(openSamlObjects)
        EntityDescriptorConversionUtils.setEntityService(entityService)
    }

    @WithMockAdmin
    def 'GET /entities/{resourceId} non-existent'() {
        expect:
        try {
            mockMvc.perform(get("/api/entities/uuid-1"))
        }
        catch (Exception e) {
            e instanceof PersistentEntityNotFound
        }
    }

    @WithMockAdmin
    def 'GET /entities/{resourceId} existing'() {
        given:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "admingroup")
        entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()
        entityManager.clear()

        when:
        def result = mockMvc.perform(get("/api/entities/eid1"))

        then:
        result.andExpect(status().isOk())
                .andExpect(jsonPath("\$.entityId").value("eid1"))
                .andExpect(jsonPath("\$.serviceProviderName").value("sp1"))
                .andExpect(jsonPath("\$.serviceEnabled").value(true))
                .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /entities/{resourceId} existing, validate group access'() {
        given:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: "someUser")
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())

        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)

        ownershipRepository.saveAndFlush(new Ownership(g, entityDescriptorOne))
        ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, entityDescriptorTwo))

        when:
        def result = mockMvc.perform(get("/api/entities/eid1"))

        then:
        result.andExpect(status().isOk())
                .andExpect(jsonPath("\$.entityId").value("eid1"))
                .andExpect(jsonPath("\$.serviceProviderName").value("sp1"))
                .andExpect(jsonPath("\$.serviceEnabled").value(true))
                .andExpect(jsonPath("\$.idOfOwner").value("someUser"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /entities/{resourceId} existing, owned by some other user'() {
        when:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: Group.ADMIN_GROUP.getOwnerId())

        entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        entityDescriptorRepository.saveAndFlush(entityDescriptorTwo)

        ownershipRepository.saveAndFlush(new Ownership(g, entityDescriptorOne))
        ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, entityDescriptorTwo))

        then:
        try {
            mockMvc.perform(get("/api/entities/eid2"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def 'GET /entities/{resourceId} existing (xml)'() {
        given:
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true)
        entityDescriptorOne.setElementLocalName("EntityDescriptor")
        entityDescriptorOne.setNamespacePrefix("md")
        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
        entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor
	xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="eid1"/>"""

        when:
        def result = mockMvc.perform(get("/api/entities/eid1").accept(APPLICATION_XML))

        then:
        result.andExpect(status().isOk()).andExpect(content().xml(expectedXML))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /entities/{resourceId} existing (xml), user-owned'() {
        given:
        Group g = userService.getCurrentUserGroup()

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        entityDescriptorOne.setElementLocalName("EntityDescriptor")
        entityDescriptorOne.setNamespacePrefix("md")
        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
        entityDescriptorOne = entityDescriptorRepository.saveAndFlush(entityDescriptorOne)
        ownershipRepository.saveAndFlush(new Ownership(g,entityDescriptorOne))

        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="eid1"/>"""

        when:
        def result = mockMvc.perform(get("/api/entities/eid1").accept(APPLICATION_XML))

        then:
        result.andExpect(status().isOk()).andExpect(content().xml(expectedXML))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET /entities/{resourceId} existing (xml), other user-owned'() {
        when:
        Group g = Group.ADMIN_GROUP

        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true, idOfOwner: g.getOwnerId())
        entityDescriptorOne.setElementLocalName("EntityDescriptor")
        entityDescriptorOne.setNamespacePrefix("md")
        entityDescriptorOne.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")
        entityDescriptorRepository.save(entityDescriptorOne)
        entityManager.flush()

        then:
        try {
            mockMvc.perform(get("/api/entities/eid1").accept(APPLICATION_XML))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }
}