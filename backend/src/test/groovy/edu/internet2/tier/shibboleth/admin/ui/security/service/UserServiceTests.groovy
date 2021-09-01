package edu.internet2.tier.shibboleth.admin.ui.security.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import org.springframework.transaction.annotation.Transactional

class UserServiceTests extends AbstractBaseDataJpaTest {
    @Transactional
    def setup() {
        userRepository.findAll().forEach {
            userService.delete(it.getUsername())
        }
        userRepository.flush()

        groupService.clearAllForTesting() //leaves us just the admingroup
    }
    
    def "When creating user, user is set to the correct group"() {
        given:
        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        
        when:        
        User result = userService.save(user)
        
        then:
        result.groupId == "testingGroupBBB"
        result.username == "someUser"
        result.userGroups.size() == 1
        
        // Raw check that the DB is correct for ownership
        Set<Ownership> users = ownershipRepository.findUsersByOwner(gb)
        users.size() == 1
        users[0].ownedId == "someUser"
        
        // Validate that loading the group has the correct list as well
        Group g = groupService.find("testingGroupBBB")
        g.ownedItems.size() == 1
    }

    def "When updating user, user is set to the correct group"() {
        given:
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
        
        Group gb = new Group()
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        gb = groupService.createGroup(gb)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        user.setGroup(gb)
        User userInB = userService.save(user)
        
        when:
        userInB.setGroupId("testingGroup") // changing groups will happen by updating the user's groupid (from the ui)
        User result = userService.save(userInB)
                
        then:
        result.groupId == "testingGroup"
        result.username == "someUser"
        result.userGroups.size() == 1
        
        // Raw check that the DB is correct for ownership
        Set<Ownership> users = ownershipRepository.findUsersByOwner(ga)
        users.size() == 1
        users[0].ownedId == "someUser"
        
        // check db is correct for the previous group as well
        Set<Ownership> users2 = ownershipRepository.findUsersByOwner(gb)
        users2.size() == 0

        // Validate that loading the group has the correct list as well
        Group g = groupService.find("testingGroup")
        g.ownedItems.size() == 1
        
        Group g2 = groupService.find("testingGroupBBB")
        g2.ownedItems.size() == 0
    }
        
    def "logically try to match user controller test causing headaches"() {
        given:
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", firstName: "Fred", lastName: "Flintstone", roles:[userRole.get()], password: "foo")
        user.setGroup(ga)
        userService.save(user)
        
        when:
        User flintstoneUser = userRepository.findByUsername("someUser").get()
        flintstoneUser.setFirstName("Wilma")
        flintstoneUser.setGroupId("testingGroup")
        
        User result = userService.save(flintstoneUser)
                
        then:
        result.groupId == "testingGroup"
        result.username == "someUser"
        result.userGroups.size() == 1
        result.firstName == "Wilma"
    }
    
    def "When creating user, user with multiple groups is saved correctly"() {
        given:
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
        
        Group gb = new Group()
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
        
        // Raw check that the DB is correct for ownership
        Set<Ownership> users = ownershipRepository.findUsersByOwner(ga)
        users.size() == 1
        users[0].ownedId == "someUser"
        
        Set<Ownership> users2 = ownershipRepository.findUsersByOwner(gb)
        users2.size() == 1
        users2[0].ownedId == "someUser"
        
        when:
        def userFromDb = userRepository.findById(result.id).get()
        
        then:
        userFromDb.getUserGroups().size() == 2
        
        when:
        Group gbUpdated = groupService.find("testingGroupBBB")
        
        then:
        gbUpdated.ownedItems.size() == 1
    }
}