package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.GrantType
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import org.hamcrest.Matchers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import spock.lang.Subject

import javax.persistence.EntityManager

import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class DynamicRegistrationControllerTests extends AbstractBaseDataJpaTest {
    @Autowired
    DynamicRegistrationService dynamicRegistrationService;

    @Autowired
    DynamicRegistrationInfoRepository repo

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityService entityService

    @Autowired
    ObjectMapper mapper

    def mockMvc

    @Subject
    def controller

    @Transactional
    def setup() {
        Group ga = new Group()
        ga.setResourceId("testingGroupAAA")
        ga.setName("Group AAA")
        ga = groupService.createGroup(ga)

        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)

        controller = new DynamicRegistrationController()
        controller.dynamicRegistrationService = dynamicRegistrationService
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        userService.save(user)
    }

    @WithMockAdmin
    def 'DELETE as admin'() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "admingroup", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)
        def dris = repo.findAll()

        expect:
        dris.size() == 1

        when:
        def result = mockMvc.perform(delete("/api/DynamicRegistration/" + dris.get(0).getResourceId()))

        then:
        result.andExpect(status().isNoContent())
        repo.findByResourceId("uuid-1") == null
        repo.findAll().size() == 0

        // persistent entity doesn't exist
        try {
            def result2 = mockMvc.perform(delete("/api/DynamicRegistration/uuid-1"))
        } catch (Exception e) {
            e instanceof PersistentEntityNotFound
        }
    }


    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'DELETE as non-admin'() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "admingroup", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)
        def dris = repo.findAll()

        expect:
        dris.size() == 1
        try {
            def result = mockMvc.perform(delete("/api/DynamicRegistration/" + dris.get(0).getResourceId()))
        } catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def 'GET /DynamicRegistrations with empty repository as admin'() {
        when:
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        then:
        result.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON)).andExpect(content().json('[]'))
    }

    @WithMockAdmin
    def 'GET /DynamicRegistrations with 1 record in repository as admin'() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "admingroup", applicationType: 'apptype',
                                                 approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
                                                 redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                                                 tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)

        when:
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        then:
        result.andDo(MockMvcResultHandlers.print())
              .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.[0].resourceId").value("uuid-1"))
              .andExpect(jsonPath("\$.[0].enabled").value(false))
              .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
              .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
              .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
              .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
              .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
              .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
              .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
              .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
              .andExpect(jsonPath("\$.[0].scope").value("scope"))
              .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
              .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
              .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
              .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

        when: // add another so there should be two results
        def dynReg2 = new DynamicRegistrationInfo(resourceId: 'uuid-2', enabled: false, idOfOwner: "admingroup", applicationType: 'apptype2',
                approved: true, contacts: 'contacts2', jwks: 'jwks2', logoUri: 'logouri2', policyUri: 'policyuri2',
                redirectUris: 'redirecturis2', responseTypes: 'responsetypes2', scope: 'scope2', subjectType: 'subjecttype2',
                tokenEndpointAuthMethod: 'token2', tosUri: 'tosuri2', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg2)
        def result2 = mockMvc.perform(get('/api/DynamicRegistrations'))

        then:
        result2.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
               .andExpect(jsonPath("\$.[0].resourceId").value("uuid-1"))
               .andExpect(jsonPath("\$.[0].enabled").value(false))
               .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
               .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
               .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
               .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
               .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
               .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
               .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
               .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
               .andExpect(jsonPath("\$.[0].scope").value("scope"))
               .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
               .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
               .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
               .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

               .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
               .andExpect(jsonPath("\$.[1].resourceId").value("uuid-2"))
               .andExpect(jsonPath("\$.[1].enabled").value(false))
               .andExpect(jsonPath("\$.[1].idOfOwner").value("admingroup"))
               .andExpect(jsonPath("\$.[1].applicationType").value("apptype2"))
               .andExpect(jsonPath("\$.[1].contacts").value("contacts2"))
               .andExpect(jsonPath("\$.[1].jwks").value("jwks2"))
               .andExpect(jsonPath("\$.[1].logoUri").value("logouri2"))
               .andExpect(jsonPath("\$.[1].policyUri").value("policyuri2"))
               .andExpect(jsonPath("\$.[1].redirectUris").value("redirecturis2"))
               .andExpect(jsonPath("\$.[1].responseTypes").value("responsetypes2"))
               .andExpect(jsonPath("\$.[1].scope").value("scope2"))
               .andExpect(jsonPath("\$.[1].subjectType").value("subjecttype2"))
               .andExpect(jsonPath("\$.[1].tokenEndpointAuthMethod").value("token2"))
               .andExpect(jsonPath("\$.[1].tosUri").value("tosuri2"))
               .andExpect(jsonPath("\$.[1].grantType").value("implicit"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'GET someuser /DynamicRegistrations return correct responses'() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "testingGroupAAA", applicationType: 'apptypea',
                approved: true, contacts: 'contactsa', jwks: 'jwksa', logoUri: 'logouria', policyUri: 'policyuria',
                redirectUris: 'redirecturisa', responseTypes: 'responsetypesa', scope: 'scopea', subjectType: 'subjecttypea',
                tokenEndpointAuthMethod: 'tokena', tosUri: 'tosuria', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)

        when:
        def result1 = mockMvc.perform(get('/api/DynamicRegistrations'))

        then:
        result1.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON)).andExpect(jsonPath("\$").isEmpty())

        when:
        def dynReg2 = new DynamicRegistrationInfo(resourceId: 'uuid-2', enabled: false, applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri', name: 'foo',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        dynamicRegistrationService.createNew(new DynamicRegistrationRepresentation(dynReg2))
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        then:
        result.andDo(MockMvcResultHandlers.print())
              .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$", Matchers.hasSize(1)))
              .andExpect(jsonPath("\$.[0].resourceId").value("uuid-2"))
              .andExpect(jsonPath("\$.[0].enabled").value(false))
              .andExpect(jsonPath("\$.[0].idOfOwner").value("testingGroupBBB"))
              .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
              .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
              .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
              .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
              .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
              .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
              .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
              .andExpect(jsonPath("\$.[0].scope").value("scope"))
              .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
              .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
              .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
              .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

        try {
            mockMvc.perform(get('/api/DynamicRegistration/uuid-1'))
        } catch (Exception e) {
            e instanceof ForbiddenException
        }

        def result2 = mockMvc.perform(get('/api/DynamicRegistration/uuid-2'))
        result2.andDo(MockMvcResultHandlers.print())
               .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
               .andExpect(jsonPath("\$.resourceId").value("uuid-2"))
               .andExpect(jsonPath("\$.enabled").value(false))
               .andExpect(jsonPath("\$.idOfOwner").value("testingGroupBBB"))
               .andExpect(jsonPath("\$.applicationType").value("apptype"))
               .andExpect(jsonPath("\$.contacts").value("contacts"))
               .andExpect(jsonPath("\$.jwks").value("jwks"))
               .andExpect(jsonPath("\$.logoUri").value("logouri"))
               .andExpect(jsonPath("\$.policyUri").value("policyuri"))
               .andExpect(jsonPath("\$.redirectUris").value("redirecturis"))
               .andExpect(jsonPath("\$.responseTypes").value("responsetypes"))
               .andExpect(jsonPath("\$.scope").value("scope"))
               .andExpect(jsonPath("\$.subjectType").value("subjecttype"))
               .andExpect(jsonPath("\$.tokenEndpointAuthMethod").value("token"))
               .andExpect(jsonPath("\$.tosUri").value("tosuri"))
               .andExpect(jsonPath("\$.grantType").value("implicit"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def 'POST create new '() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-2', enabled: false, applicationType: 'apptype', name: 'foo',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        def driJson = mapper.writeValueAsString(dynReg)

        when:
        def result = mockMvc.perform(post('/api/DynamicRegistration').contentType(APPLICATION_JSON).content(driJson))

        then:
        result.andDo(MockMvcResultHandlers.print())
              .andExpect(status().isCreated()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.resourceId").value("uuid-2"))
              .andExpect(jsonPath("\$.enabled").value(false))
              .andExpect(jsonPath("\$.idOfOwner").value("testingGroupBBB"))
              .andExpect(jsonPath("\$.applicationType").value("apptype"))
              .andExpect(jsonPath("\$.contacts").value("contacts"))
              .andExpect(jsonPath("\$.jwks").value("jwks"))
              .andExpect(jsonPath("\$.logoUri").value("logouri"))
              .andExpect(jsonPath("\$.policyUri").value("policyuri"))
              .andExpect(jsonPath("\$.redirectUris").value("redirecturis"))
              .andExpect(jsonPath("\$.responseTypes").value("responsetypes"))
              .andExpect(jsonPath("\$.scope").value("scope"))
              .andExpect(jsonPath("\$.subjectType").value("subjecttype"))
              .andExpect(jsonPath("\$.tokenEndpointAuthMethod").value("token"))
              .andExpect(jsonPath("\$.tosUri").value("tosuri"))
              .andExpect(jsonPath("\$.grantType").value("implicit"))

    }

    @WithMockAdmin
    def "PUT /DynamicRegistration updates properly as admin"() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "admingroup", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri', name: 'foo',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        expect:
        result.andDo(MockMvcResultHandlers.print())
              .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.[0].resourceId").value("uuid-1"))
              .andExpect(jsonPath("\$.[0].enabled").value(false))
              .andExpect(jsonPath("\$.[0].idOfOwner").value("admingroup"))
              .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
              .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
              .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
              .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
              .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
              .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
              .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
              .andExpect(jsonPath("\$.[0].scope").value("scope"))
              .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
              .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
              .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
              .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

        when:
        def dri = repo.findByResourceId("uuid-1")
        DynamicRegistrationRepresentation drr = new DynamicRegistrationRepresentation(dri)
        drr.setApplicationType("apptype2")
        drr.setJwks("jwks2")
        drr.setContacts("contacts2")
        drr.setEnabled(true)
        def drrJson = mapper.writeValueAsString(drr)
        def update = mockMvc.perform(put("/api/DynamicRegistration/uuid-1").contentType(APPLICATION_JSON).content(drrJson))

        then:
        update.andDo(MockMvcResultHandlers.print())
              .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.resourceId").value("uuid-1"))
              .andExpect(jsonPath("\$.enabled").value(true))
              .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))
              .andExpect(jsonPath("\$.applicationType").value("apptype2"))
              .andExpect(jsonPath("\$.contacts").value("contacts2"))
              .andExpect(jsonPath("\$.jwks").value("jwks2"))
              .andExpect(jsonPath("\$.logoUri").value("logouri"))
              .andExpect(jsonPath("\$.policyUri").value("policyuri"))
              .andExpect(jsonPath("\$.redirectUris").value("redirecturis"))
              .andExpect(jsonPath("\$.responseTypes").value("responsetypes"))
              .andExpect(jsonPath("\$.scope").value("scope"))
              .andExpect(jsonPath("\$.subjectType").value("subjecttype"))
              .andExpect(jsonPath("\$.tokenEndpointAuthMethod").value("token"))
              .andExpect(jsonPath("\$.tosUri").value("tosuri"))
              .andExpect(jsonPath("\$.grantType").value("implicit"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def "PUT /DynamicRegistration disallows non-admin user from enabling"() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "testingGroupBBB", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri', name: 'foo',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        expect:
        result.andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$.[0].resourceId").value("uuid-1"))
                .andExpect(jsonPath("\$.[0].enabled").value(false))
                .andExpect(jsonPath("\$.[0].idOfOwner").value("testingGroupBBB"))
                .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
                .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
                .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
                .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
                .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
                .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
                .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
                .andExpect(jsonPath("\$.[0].scope").value("scope"))
                .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
                .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
                .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
                .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

        when:
        def dri = repo.findByResourceId("uuid-1")
        DynamicRegistrationRepresentation drr = new DynamicRegistrationRepresentation(dri)
        drr.setApplicationType("apptype2")
        drr.setJwks("jwks2")
        drr.setContacts("contacts2")
        drr.setEnabled(true)
        def drrJson = mapper.writeValueAsString(drr)

        then:
        try {
            mockMvc.perform(put("/api/DynamicRegistration/uuid-1").contentType(APPLICATION_JSON).content(drrJson))
        } catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def "PUT /DynamicRegistration denies the request if the PUTing user is not an ADMIN and not in the owner group"() {
        when:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "testingGroupAAA", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri', name: 'foo',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        def dri = repo.saveAndFlush(dynReg)

        DynamicRegistrationRepresentation drr = new DynamicRegistrationRepresentation(dri)
        drr.setApplicationType("apptype2")
        def drrJson = mapper.writeValueAsString(drr)

        then:
        try {
            mockMvc.perform(put("/api/DynamicRegistration/uuid-1").contentType(APPLICATION_JSON).content(drrJson))
        } catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockAdmin
    def "PUT /DynamicRegistration update group as admin"() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "AAA", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri', name: 'foo',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        expect:
        result.andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$.[0].resourceId").value("uuid-1"))
                .andExpect(jsonPath("\$.[0].enabled").value(false))
                .andExpect(jsonPath("\$.[0].idOfOwner").value("AAA"))
                .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
                .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
                .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
                .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
                .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
                .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
                .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
                .andExpect(jsonPath("\$.[0].scope").value("scope"))
                .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
                .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
                .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
                .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

        when:
        def update = mockMvc.perform(put("/api/DynamicRegistration/uuid-1/changeGroup/testingGroupBBB"))

        then:
        update.andDo(MockMvcResultHandlers.print())
              .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.resourceId").value("uuid-1"))
              .andExpect(jsonPath("\$.enabled").value(false))
              .andExpect(jsonPath("\$.idOfOwner").value("testingGroupBBB"))
              .andExpect(jsonPath("\$.applicationType").value("apptype"))
              .andExpect(jsonPath("\$.contacts").value("contacts"))
              .andExpect(jsonPath("\$.jwks").value("jwks"))
              .andExpect(jsonPath("\$.logoUri").value("logouri"))
              .andExpect(jsonPath("\$.policyUri").value("policyuri"))
              .andExpect(jsonPath("\$.redirectUris").value("redirecturis"))
              .andExpect(jsonPath("\$.responseTypes").value("responsetypes"))
              .andExpect(jsonPath("\$.scope").value("scope"))
              .andExpect(jsonPath("\$.subjectType").value("subjecttype"))
              .andExpect(jsonPath("\$.tokenEndpointAuthMethod").value("token"))
              .andExpect(jsonPath("\$.tosUri").value("tosuri"))
              .andExpect(jsonPath("\$.grantType").value("implicit"))
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def "PUT /DynamicRegistration update group as user shouldn't work "() {
        given:
        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "testingGroupBBB", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri', name: 'foo',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        repo.saveAndFlush(dynReg)
        def result = mockMvc.perform(get('/api/DynamicRegistrations'))

        expect:
        result.andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$.[0].resourceId").value("uuid-1"))
                .andExpect(jsonPath("\$.[0].enabled").value(false))
                .andExpect(jsonPath("\$.[0].idOfOwner").value("testingGroupBBB"))
                .andExpect(jsonPath("\$.[0].applicationType").value("apptype"))
                .andExpect(jsonPath("\$.[0].contacts").value("contacts"))
                .andExpect(jsonPath("\$.[0].jwks").value("jwks"))
                .andExpect(jsonPath("\$.[0].logoUri").value("logouri"))
                .andExpect(jsonPath("\$.[0].policyUri").value("policyuri"))
                .andExpect(jsonPath("\$.[0].redirectUris").value("redirecturis"))
                .andExpect(jsonPath("\$.[0].responseTypes").value("responsetypes"))
                .andExpect(jsonPath("\$.[0].scope").value("scope"))
                .andExpect(jsonPath("\$.[0].subjectType").value("subjecttype"))
                .andExpect(jsonPath("\$.[0].tokenEndpointAuthMethod").value("token"))
                .andExpect(jsonPath("\$.[0].tosUri").value("tosuri"))
                .andExpect(jsonPath("\$.[0].grantType").value("implicit"))

        try {
            def update = mockMvc.perform(put("/api/DynamicRegistration/uuid-1/changeGroup/testingGroupAAA"))
        } catch (Exception e) {
            e instanceof ForbiddenException
        }
    }
}