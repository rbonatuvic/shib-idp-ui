package net.unicon.shibui.pac4j

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.pac4j.core.matching.PathMatcher
import org.pac4j.saml.profile.SAML2Profile
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification
import spock.lang.Subject

import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@DataJpaTest
@ContextConfiguration(classes=[Pac4JTestingConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext
@EnableConfigurationProperties([Pac4jConfigurationProperties])
class AddNewUserFilterTests extends Specification {
    @Subject
    AddNewUserFilter addNewUserFilter

    @Autowired
    GroupServiceForTesting groupService

    @Autowired
    OwnershipRepository ownershipRepository

    @Autowired
    RoleRepository roleRepository

    @Autowired
    Pac4jConfigurationProperties pac4jConfigurationProperties

    @Autowired
    UserRepository userRepository

    @Autowired
    UserService userService

    HttpServletRequest request = Mock()
    HttpServletResponse response = Mock()
    FilterChain chain = Mock()

    SecurityContext securityContext = Mock()
    Authentication authentication = Mock()
    SAML2Profile saml2Profile = Mock()

    Pac4jConfigurationProperties.SimpleProfileMapping profileMapping

    @Transactional
    def setup() {
        SecurityContextHolder.setContext(securityContext)
        securityContext.getAuthentication() >> authentication
        authentication.getPrincipal() >> saml2Profile

        addNewUserFilter = new AddNewUserFilter(pac4jConfigurationProperties, userService, roleRepository, new PathMatcher(), groupService, Optional.empty())
        profileMapping = pac4jConfigurationProperties.simpleProfileMapping

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

    def "new user created"() {
        given:
        ['Username': 'newUser',
         'FirstName': 'New',
         'LastName': 'User',
         'Email': 'newuser@institution.edu'].each { key, value ->
            saml2Profile.getAttribute(profileMapping."get${key}"()) >> [value]
        }
        saml2Profile.getUsername() >> "newUser"

        when:
        addNewUserFilter.doFilter(request, response, chain)

        then:
        1 * response.sendRedirect("/unsecured/error.html")
        User user = userRepository.findByUsername("newUser").get()
        user.getGroupId() == "newUser"
    }

    def "new user created with group - assumes saml2profile got property for groups"() {
        given:
        ['Username': 'newUser',
         'FirstName': 'New',
         'LastName': 'User',
         'Email': 'newuser@institution.edu',
         'Groups':'AAAGroup'
        ].each { key, value ->
            saml2Profile.getAttribute(profileMapping."get${key}"()) >> [value]
        }
        saml2Profile.getUsername() >> "newUser"

        when:
        addNewUserFilter.doFilter(request, response, chain)

        then:
        1 * response.sendRedirect("/unsecured/error.html")
        User user = userRepository.findByUsername("newUser").get()
        user.getGroupId() == "AAAGroup"
    }
}