package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.GrantType
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Subject

import javax.transaction.Transactional

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
// TODO: This is only checking activation for EntityDescriptors. Expanding for resolvers not included
class ActivateControllerTests extends AbstractBaseDataJpaTest {
    @Subject
    def controller

    @Autowired
    ObjectMapper mapper

    @Autowired
    DynamicRegistrationInfoRepository dynamicRegistrationInfoRepository

    @Autowired
    DynamicRegistrationService dynamicRegistrationService

    @Autowired
    EntityService entityService

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    private EntityDescriptorService entDescriptorService;

    @Autowired
    OpenSamlObjects openSamlObjects

    def defaultEntityDescriptorResourceId
    def mockMvc

    @Transactional
    def setup() {
        controller = new ActivateController()
        controller.entityDescriptorService = entDescriptorService
        controller.dynamicRegistrationService = dynamicRegistrationService
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        EntityDescriptorConversionUtils.setOpenSamlObjects(openSamlObjects)
        EntityDescriptorConversionUtils.setEntityService(entityService)

        groupService.clearAllForTesting()
        List<Group> apprGroups = new ArrayList<>()
        String[] groupNames = ['BBB', 'CCC', 'AAA']
        groupNames.each {name -> {
            Group group = new Group().with({
                it.name = name
                it.description = name
                it.resourceId = name
                it
            })
            if (name != "AAA") {
                apprGroups.add(groupRepository.save(group))
            } else {
                Approvers approvers = new Approvers()
                approvers.setApproverGroups(apprGroups)
                List<Approvers> apprList = new ArrayList<>()
                apprList.add(approversRepository.save(approvers))
                group.setApproversList(apprList)
                groupRepository.save(group)
            }
        }}
        Group group = new Group().with({
            it.name = 'DDD'
            it.description = 'DDD'
            it.resourceId = 'DDD'
            it
        })
        groupRepository.save(group)
        entityManager.flush()
        entityManager.clear()

        Optional<Role> userRole = roleRepository.findByName("ROLE_ENABLE")
        User user = new User(username: "AUser", roles:[userRole.get()], password: "foo")
        user.setGroup(groupRepository.findByResourceId("AAA"))
        userService.save(user)
        user = new User(username: "BUser", roles:[userRole.get()], password: "foo")
        user.setGroup(groupRepository.findByResourceId("BBB"))
        userService.save(user)
        user = new User(username: "DUser", roles:[userRole.get()], password: "foo")
        user.setGroup(groupRepository.findByResourceId("DDD"))
        userService.save(user)

        entityManager.flush()
        entityManager.clear()

        EntityDescriptor entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false, idOfOwner: 'AAA')
        entityDescriptor = entityDescriptorRepository.save(entityDescriptor)

        defaultEntityDescriptorResourceId = entityDescriptor.getResourceId()

        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-1', enabled: false, idOfOwner: "AAA", applicationType: 'apptype',
                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
        dynamicRegistrationInfoRepository.saveAndFlush(dynReg)
    }

    @WithMockUser(value = "AUser", roles = ["USER"])
    def 'Owner group cannot activate their own dynamic registration without approvals'() {
        expect:
        try {
            mockMvc.perform(patch("/api/activate/DynamicRegistration/uuid-1/enable"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockUser(value = "AUser", roles = ["USER"])
    def 'Owner group cannot activate their own entity descriptor without approvals'() {
        expect:
        try {
            mockMvc.perform(patch("/api/activate/entityDescriptor/" + defaultEntityDescriptorResourceId + "/enable"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockUser(value = "DUser", roles = ["USER"])
    def 'non-owner group cannot activate dynamic registration'() {
        expect:
        try {
            mockMvc.perform(patch("/api/activate/DynamicRegistration/uuid-1/enable"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

    @WithMockUser(value = "DUser", roles = ["USER"])
    def 'non-owner group cannot activate entity descriptor'() {
        expect:
        try {
            mockMvc.perform(patch("/api/activate/entityDescriptor/" + defaultEntityDescriptorResourceId + "/enable"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
    }

//    @WithMockAdmin
//    def 'Admin can activate an dynamic registration without approval'() {
//        given:
//        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-2', enabled: false, applicationType: 'apptype',
//                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
//                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
//                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
//        dynamicRegistrationService.createNew(new DynamicRegistrationRepresentation(dynReg))
//
//        when:
//        def result = mockMvc.perform(patch("/api/activate/DynamicRegistration/uuid-2/enable"))
//
//        then:
//        result.andExpect(status().isOk())
//              .andExpect(jsonPath("\$.resourceId").value("uuid-2"))
//              .andExpect(jsonPath("\$.enabled").value(true))
//    }

    @WithMockAdmin
    def 'Admin can activate an entity descriptor without approval'() {
        when:
        def result = mockMvc.perform(patch("/api/activate/entityDescriptor/" + defaultEntityDescriptorResourceId + "/enable"))

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath("\$.id").value(defaultEntityDescriptorResourceId))
              .andExpect(jsonPath("\$.serviceEnabled").value(true))
    }

//    @WithMockUser(value = "AUser", roles = ["USER"])
//    def 'Owner group can enable their own dynamic registration with approvals'() {
//        when:
//        def dynReg = new DynamicRegistrationInfo(resourceId: 'uuid-2', enabled: false, idOfOwner: "AAA", applicationType: 'apptype',
//                approved: true, contacts: 'contacts', jwks: 'jwks', logoUri: 'logouri', policyUri: 'policyuri',
//                redirectUris: 'redirecturis', responseTypes: 'responsetypes', scope: 'scope', subjectType: 'subjecttype',
//                tokenEndpointAuthMethod: 'token', tosUri: 'tosuri', grantType: GrantType.implicit)
//        dynReg = dynamicRegistrationService.createNew(dynReg)
//        dynReg.addApproval(groupService.find("CCC"))
//        dynamicRegistrationService.update(dynReg)
//        entityManager.flush()
//
//        def result = mockMvc.perform(patch("/api/activate/DynamicRegistration/uuid-2/enable"))
//
//        then:
//        result.andExpect(status().isOk())
//              .andExpect(jsonPath("\$.resourceId").value('uuid-2'))
//              .andExpect(jsonPath("\$.enabled").value(true))
//    }

    @WithMockUser(value = "AUser", roles = ["USER"])
    def 'Owner group can enable their own entity descriptor with approvals'() {
        when:
        EntityDescriptor entityDescriptor = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp1', serviceEnabled: false, idOfOwner: 'AAA')
        entityDescriptor.addApproval(groupService.find("CCC"))
        entityDescriptorRepository.save(entityDescriptor)

        def result = mockMvc.perform(patch("/api/activate/entityDescriptor/uuid-2/enable"))

        then:
        result.andExpect(status().isOk())
              .andExpect(jsonPath("\$.id").value('uuid-2'))
              .andExpect(jsonPath("\$.serviceEnabled").value(true))
    }
}