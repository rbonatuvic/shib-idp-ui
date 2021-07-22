package edu.internet2.tier.shibboleth.admin.ui.security.service

import javax.persistence.EntityManager

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
import edu.internet2.tier.shibboleth.admin.ui.security.model.UserGroup
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserGroupRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import spock.lang.Specification

@ContextConfiguration(classes=[CoreShibUiConfiguration, CustomPropertiesConfiguration])
@SpringBootTest(classes = ShibbolethUiApplication.class, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@PropertySource("classpath:application.yml")
@DirtiesContext
class UserServiceTests extends Specification {
    
    @Autowired
    EntityManager entityManager
    
    @Autowired
    IGroupService groupService

    @Autowired
    RoleRepository roleRepository
        
    @Autowired
    UserRepository userRepository

    @Autowired
    UserGroupRepository userGroupRepository
    
    @Autowired
    UserService userService
        
    @Transactional
    def setup() {
        // ensure we start fresh with only expected users and roles and groups
        userRepository.deleteAll()
        roleRepository.deleteAll()
        groupService.clearAllForTesting() //leaves us just the admingroup
        
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
    }
    
    @Rollback
    def "When creating user, user is set to the correct group"() {
        given:
        Group gb = new Group();
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        def User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        
        when:        
        def result = userService.save(user)
        
        then:
        result.groupId == "testingGroupBBB"
        result.username == "someUser"
        result.userGroups.size() == 1
        result.getUserGroups().getAt(0).id.resourceId != null
        result.getUserGroups().getAt(0).id.userId != 0
        
        Group g = groupService.find("testingGroupBBB");
        g.userGroups.size() == 1
        g.getUserGroups().getAt(0).id.resourceId != null
        g.getUserGroups().getAt(0).id.userId != 0
    }

    @Rollback
    def "When updating user, user is set to the correct group"() {
        given:
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
        
        Group gb = new Group();
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        def User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        def User userInB = userService.save(user)
        
        when:
        userInB.setGroup(ga)
        def User result = userService.save(user)
        def List<UserGroup> usersGroups = userGroupRepository.findAllByUser(result)
        
        then:
        usersGroups.size() == 1
        usersGroups.get(0).group.getResourceId() == "testingGroup" 
        
        result.groupId == "testingGroup"
        result.username == "someUser"
        result.userGroups.size() == 1
        result.getUserGroups().getAt(0).id.resourceId != null
        result.getUserGroups().getAt(0).id.userId != 0
        
        Group g = groupService.find("testingGroup");
        g.userGroups.size() == 1
        g.getUserGroups().getAt(0).id.resourceId != null
        g.getUserGroups().getAt(0).id.userId != 0
    }
        
    @Rollback
    def "When creating user, user with multiple groups is saved correctly"() {
        given:
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
        
        Group gb = new Group();
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User().with( {
            it.username = "someUser"
            it.roles = [userRole.get()]
            it.password = "foo"
            it
        })
        
        HashSet<Group> groups = new HashSet<>()
        groups.add(ga)
        groups.add(gb)
        user.setGroups(groups)
        
        when:
        def result = userService.save(user)
        
        then:
        result.userGroups.size() == 2
        
        when:
        def userFromDb = userRepository.findById(result.id).get();
        
        then:
        userFromDb.getUserGroups().size() == 2
        
        when:
        Group gbUpdated = groupService.find("testingGroupBBB")
        
        then:
        gbUpdated.userGroups.size() == 1
    }
}
