package edu.internet2.tier.shibboleth.admin.ui.security.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.controller.GroupController
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.servlet.LocaleResolver
import org.springframework.web.servlet.i18n.SessionLocaleResolver
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, InternationalizationConfiguration, SearchConfiguration, LocalConfig, edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext
@ActiveProfiles(["gs-test"])
class GroupServiceTests extends Specification {
    @Autowired
    GroupServiceForTesting groupService

    @Autowired
    RoleRepository roleRepository

    @Autowired
    UserService userService

    @Transactional
    def setup() {
        groupService.ensureAdminGroupExists()

        if (roleRepository.count() == 0) {
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

        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN")
        User adminUser = new User(username: "admin", roles: [adminRole.get()], password: "foo")
        userService.save(adminUser)

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        userService.save(user)
    }

    def "Test the validation for regex works"() {
        given:
        Group g = new Group()
        g.setResourceId("twitter")
        g.setName("twitter")
        g.setValidationRegex(null)

        when:
        try {
            g = groupService.createGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == Group.DEFAULT_REGEX

        when:
        g.setValidationRegex("/*")
        try {
            g = groupService.updateGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == "/*"

        when:
        g.setValidationRegex("^(http:\\\\/\\\\/www\\\\.|https:\\\\/\\\\/www\\\\.|http:\\\\/\\\\/|https:\\\\/\\\\/)?[a-z0-9]+([\\\\-\\\\.]twitter+)\\\\.[a-z]{2,5}(:[0-9]{1,5})?(\\\\/.*)?\\\$")
        try {
            g = groupService.updateGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == "^(http:\\\\/\\\\/www\\\\.|https:\\\\/\\\\/www\\\\.|http:\\\\/\\\\/|https:\\\\/\\\\/)?[a-z0-9]+([\\\\-\\\\.]twitter+)\\\\.[a-z]{2,5}(:[0-9]{1,5})?(\\\\/.*)?\\\$"

        when:
        g.setValidationRegex("*")

        then:
        try {
            g = groupService.updateGroup(g)
            false
        } catch (InvalidGroupRegexException shouldOccur) {
            true
        }
    }

    @TestConfiguration
    @Profile("gs-test")
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
    }
}