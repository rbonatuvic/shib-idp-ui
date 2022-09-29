package edu.internet2.tier.shibboleth.admin.ui

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.repository.ApproversRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import javax.persistence.EntityManager

// The commented out lines show how to run the JPA tests using a file back h2 db - typically you'd switch if you want
// to access the db during testing to see what is happening in the db. Additionally, you have to use the file version of h2
// if you want to use the reset, as the in mem version won't allow multiple different access connections to be created.
//@DataJpaTest (properties = ["spring.datasource.url=jdbc:h2:file:/tmp/myApplicationDb;AUTO_SERVER=TRUE",
//                            "spring.datasource.username=sa",
//                            "spring.datasource.password=",
//                            "spring.jpa.hibernate.ddl-auto=create-drop"])
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DataJpaTest
@ContextConfiguration(classes = [BaseDataJpaTestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
abstract class AbstractBaseDataJpaTest extends Specification implements ResetsDatabaseTrait {
    @Autowired
    ApproversRepository approversRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    GroupsRepository groupRepository

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

    // ensure roles are in a known good state and that we have an admin user and group
    @Transactional
    def setup() {
//        dbsetup()
        groupService.clearAllForTesting()
        userRepository.deleteAll()
        ownershipRepository.deleteAll()
        roleRepository.deleteAll()

        def roles = [new Role().with {
            name = 'ROLE_ADMIN'
            it
        }, new Role().with {
            name = 'ROLE_USER'
            it
        }, new Role().with {
            name = 'ROLE_ENABLE'
            it
        }, new Role().with {
            name = 'ROLE_NONE'
            it
        }]
        roles.each {
            if (roleRepository.findByName(it.name).isEmpty()) {
                roleRepository.save(it)
            }
        }

        createAdminUser()
        GroupUpdatedEntityListener.init(ownershipRepository)
        UserUpdatedEntityListener.init(ownershipRepository, groupRepository)
    }

    def cleanup() {
        entityManager.clear()
//        dbcleanup()
    }

    protected createAdminUser() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN")
            User adminUser = new User(username: "admin", roles: [adminRole.get()], password: "foo")
            userService.save(adminUser)
        }
    }
}