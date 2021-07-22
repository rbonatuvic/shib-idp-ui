package edu.internet2.tier.shibboleth.admin.ui.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.PropertySource
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional

import edu.internet2.tier.shibboleth.admin.ui.ShibbolethUiApplication
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import spock.lang.Specification

@ContextConfiguration(classes=[CoreShibUiConfiguration, CustomPropertiesConfiguration])
@SpringBootTest(classes = ShibbolethUiApplication.class, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@PropertySource("classpath:application.yml")
@DirtiesContext
class JPAEntityDescriptorServiceImplTests2 extends Specification {
    
    @Autowired
    IGroupService groupService

    @Autowired
    RoleRepository roleRepository
    
    @Autowired
    JPAEntityDescriptorServiceImpl service
        
    @Autowired
    UserRepository userRepository

    @Autowired
    UserService userService
        
    @Transactional
    def setup() {
        // ensure we start fresh with only expected users and roles and groups
        userRepository.deleteAll()
        roleRepository.deleteAll()
        groupService.clearAllForTesting()
        
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
               
        Group gb = new Group();
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)
        
        def roles = [new Role().with {
            name = 'ROLE_ADMIN'
            it
        }, new Role().with {
            name = 'ROLE_USER'
            it
        }, new Role().with {
            name = 'ROLE_NONE'
            it
        }]
        roles.each {
            roleRepository.save(it)
        }      
        
        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN")
        User adminUser = new User(username: "admin", roles: [adminRole.get()], password: "foo")
        userService.save(adminUser)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo", group: gb)
        userService.save(user)
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    @Rollback
    def "When creating Entity Descriptor, ED is assigned to the user's group"() {
        given:
        User current = userService.getCurrentUser()
        current.setGroupId("testingGroupBBB")

        def expectedCreationDate = '2017-10-23T11:11:11'
        def expectedEntityId = 'https://shib'
        def expectedSpName = 'sp1'
        def expectedUUID = 'uuid-1'
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/EntityDescriptor/$expectedUUID"
        def entityDescriptor = new EntityDescriptor(resourceId: expectedUUID, entityID: expectedEntityId, serviceProviderName: expectedSpName, serviceEnabled: false)
        
        when:
        def result = service.createNew(entityDescriptor)
        
        then:
        ((EntityDescriptorRepresentation)result).getGroupId() == "testingGroupBBB"
    }
}
