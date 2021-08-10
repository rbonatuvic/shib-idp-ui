package edu.internet2.tier.shibboleth.admin.ui.security.service

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import javax.persistence.EntityManager

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Profile
import org.springframework.context.annotation.PropertySource
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer

import edu.internet2.tier.shibboleth.admin.ui.ShibbolethUiApplication
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnerType
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, CustomPropertiesConfiguration, LocalConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext
@ActiveProfiles(["test", "local"])
@ComponentScan(basePackages="{ edu.internet2.tier.shibboleth.admin.ui.configuration }")
class UserServiceTests extends Specification {
    
    @Autowired
    EntityManager entityManager
    
    @Autowired
    GroupServiceForTesting groupService

    @Autowired
    OwnershipRepository ownershipRepository
    
    @Autowired
    RoleRepository roleRepository
        
    @Autowired
    UserRepository userRepository
    
    @Autowired
    UserService userService
        
    @Transactional
    def setup() {
        userRepository.findAll().forEach {
            userService.delete(it.getUsername())
        }
        userRepository.flush()
        
        roleRepository.deleteAll()
        roleRepository.flush()
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
        def User result = userService.save(user)
        
        then:
        result.groupId == "testingGroupBBB"
        result.username == "someUser"
        result.userGroups.size() == 1
        
        // Raw check that the DB is correct for ownership
        def Set<Ownership> users = ownershipRepository.findUsersByOwner(gb)
        users.size() == 1
        users.getAt(0).ownedId == "someUser"
        
        // Validate that loading the group has the correct list as well
        Group g = groupService.find("testingGroupBBB");
        g.ownedItems.size() == 1
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
        userInB.setGroupId("testingGroup") // changing groups will happen by updating the user's groupid (from the ui)
        def User result = userService.save(userInB)
                
        then:
        result.groupId == "testingGroup"
        result.username == "someUser"
        result.userGroups.size() == 1
        
        // Raw check that the DB is correct for ownership
        def Set<Ownership> users = ownershipRepository.findUsersByOwner(ga)
        users.size() == 1
        users.getAt(0).ownedId == "someUser"
        
        // check db is correct for the previous group as well
        def Set<Ownership> users2 = ownershipRepository.findUsersByOwner(gb)
        users2.size() == 0

        // Validate that loading the group has the correct list as well
        Group g = groupService.find("testingGroup");
        g.ownedItems.size() == 1
        
        Group g2 = groupService.find("testingGroupBBB");
        g2.ownedItems.size() == 0
    }
        
    @Rollback
    def "logically try to match user controller test causing headaches"() {
        given:
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga = groupService.createGroup(ga)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        def User user = new User(username: "someUser", firstName: "Fred", lastName: "Flintstone", roles:[userRole.get()], password: "foo")
        user.setGroup(ga)
        userService.save(user)
        
        when:
        def User flintstoneUser = userRepository.findByUsername("someUser").get()
        flintstoneUser.setFirstName("Wilma")
        flintstoneUser.setGroupId("testingGroup")
        
        def User result = userService.save(flintstoneUser)
                
        then:
        result.groupId == "testingGroup"
        result.username == "someUser"
        result.userGroups.size() == 1
        result.firstName == "Wilma"
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
        
        // Raw check that the DB is correct for ownership
        def Set<Ownership> users = ownershipRepository.findUsersByOwner(ga)
        users.size() == 1
        users.getAt(0).ownedId == "someUser"
        
        def Set<Ownership> users2 = ownershipRepository.findUsersByOwner(gb)
        users2.size() == 1
        users2.getAt(0).ownedId == "someUser"
        
        when:
        def userFromDb = userRepository.findById(result.id).get();
        
        then:
        userFromDb.getUserGroups().size() == 2
        
        when:
        Group gbUpdated = groupService.find("testingGroupBBB")
        
        then:
        gbUpdated.ownedItems.size() == 1
    }
    
    @org.springframework.boot.test.context.TestConfiguration
    @Profile("local")
    static class LocalConfig {
        @Bean
        GroupServiceForTesting groupServiceForTesting(GroupsRepository repo, OwnershipRepository ownershipRepository) {
            GroupServiceForTesting result = new GroupServiceForTesting(new GroupServiceImpl().with {
                it.groupRepository = repo
                it.ownershipRepository = ownershipRepository
                return it
            })
            result.ensureAdminGroupExists()
            return result
        }

        @Bean
        ObjectMapper objectMapper() {
            JavaTimeModule module = new JavaTimeModule()
            LocalDateTimeDeserializer localDateTimeDeserializer =  new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS"))
            module.addDeserializer(LocalDateTime.class, localDateTimeDeserializer)
            return Jackson2ObjectMapperBuilder.json().modules(module).featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).build()
        }
    }
}