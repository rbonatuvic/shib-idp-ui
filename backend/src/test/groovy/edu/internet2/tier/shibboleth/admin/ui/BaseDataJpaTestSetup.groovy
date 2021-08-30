package edu.internet2.tier.shibboleth.admin.ui


import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
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
import spock.lang.Shared
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes = [BaseDataJpaTestSetupConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
abstract class BaseDataJpaTestSetup extends Specification {
    static boolean setupRun = false

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

    def setup() {
        runOnce()
    }

    // One time setup to ensure roles are in a known good state and that we have an admin user and group
    @Transactional
    runOnce() {
        if (setupRun) return

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

        if (userRepository.findByUsername("admin").isEmpty()) {
            Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN")
            User adminUser = new User(username: "admin", roles: [adminRole.get()], password: "foo")
            userService.save(adminUser)
        }
        setupRun = true
    }
}