package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.client.RestTemplate
import spock.lang.Subject

import javax.transaction.Transactional

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class ApproveControllerTests extends AbstractBaseDataJpaTest {
    @Subject
    def controller

    @Autowired
    ObjectMapper mapper

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
        controller = new ApprovalController()
        controller.entityDescriptorService = entDescriptorService
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

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
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
    }

    @WithMockUser(value = "AUser", roles = ["USER"])
    def 'Owner group cannot approve their own entity descriptor'() {
        expect:
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false
        try {
            mockMvc.perform(patch("/api/approve/entityDescriptor/" + defaultEntityDescriptorResourceId + "/approve"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false
    }

    @WithMockUser(value = "DUser", roles = ["USER"])
    def 'non-approver group cannot approve entity descriptor'() {
        expect:
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false
        try {
            mockMvc.perform(patch("/api/approve/entityDescriptor/" + defaultEntityDescriptorResourceId + "/approve"))
        }
        catch (Exception e) {
            e instanceof ForbiddenException
        }
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false
    }

    @WithMockUser(value = "BUser", roles = ["USER"])
    def 'Approver group can approve an entity descriptor'() {
        expect:
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false

        when:
        def result = mockMvc.perform(patch("/api/approve/entityDescriptor/" + defaultEntityDescriptorResourceId + "/approve"))

        then:
        result.andExpect(status().isOk())
                .andExpect(jsonPath("\$.id").value(defaultEntityDescriptorResourceId))
                .andExpect(jsonPath("\$.serviceEnabled").value(false))
                .andExpect(jsonPath("\$.approved").value(true))
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved()
    }

    @WithMockUser(value = "BUser", roles = ["USER"])
    def 'Approver can approve and un-approve an entity descriptor'() {
        expect:
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false

        when:
        def result = mockMvc.perform(patch("/api/approve/entityDescriptor/" + defaultEntityDescriptorResourceId + "/approve"))

        then:
        result.andExpect(status().isOk())
                .andExpect(jsonPath("\$.id").value(defaultEntityDescriptorResourceId))
                .andExpect(jsonPath("\$.serviceEnabled").value(false))
                .andExpect(jsonPath("\$.approved").value(true))
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved()

        when:
        def result2 = mockMvc.perform(patch("/api/approve/entityDescriptor/" + defaultEntityDescriptorResourceId + "/unapprove"))

        then:
        result2.andExpect(status().isOk())
                .andExpect(jsonPath("\$.id").value(defaultEntityDescriptorResourceId))
                .andExpect(jsonPath("\$.serviceEnabled").value(false))
                .andExpect(jsonPath("\$.approved").value(false))
        entityDescriptorRepository.findByResourceId(defaultEntityDescriptorResourceId).isApproved() == false
    }
}