package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.BaseDataJpaTestSetup
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional

class JPAEntityDescriptorServiceImplTests2 extends BaseDataJpaTestSetup {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    JPAEntityDescriptorServiceImpl entityDescriptorService

    @Transactional
    def setup() {
        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb.setValidationRegex("^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$")
        gb = groupService.createGroup(gb)

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles: [userRole.get()], password: "foo", group: gb)
        userService.save(user)

        entityDescriptorRepository.deleteAll()
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    def "When creating Entity Descriptor, ED is assigned to the user's group"() {
        given:
        User current = userService.getCurrentUser()

        def expectedEntityId = 'https://shib.org/groupsomething'
        def expectedSpName = 'sp1'
        def expectedUUID = 'uuid-1'
        def entityDescriptor = new EntityDescriptor(resourceId: expectedUUID, entityID: expectedEntityId, serviceProviderName: expectedSpName, serviceEnabled: false)

        when:
        def result = entityDescriptorService.createNew(entityDescriptor)

        then:
        ((EntityDescriptorRepresentation) result).getIdOfOwner() == "testingGroupBBB"
    }
}