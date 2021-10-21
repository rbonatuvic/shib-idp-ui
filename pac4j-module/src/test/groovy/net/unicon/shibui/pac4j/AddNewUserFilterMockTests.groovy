package net.unicon.shibui.pac4j

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.RolesServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService
import org.pac4j.core.matching.PathMatcher
import org.pac4j.saml.profile.SAML2Profile
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import spock.lang.Specification
import spock.lang.Subject

import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@SpringBootTest(classes = [Pac4jConfigurationProperties])
@EnableConfigurationProperties([Pac4jConfigurationProperties])
class AddNewUserFilterMockTests extends Specification {

    @Subject
    AddNewUserFilter addNewUserFilter

    @Autowired
    Pac4jConfigurationProperties pac4jConfigurationProperties

    Authentication authentication = Mock()
    FilterChain chain = Mock()
    EmailService emailService = Mock()
    IGroupService groupService = Mock()
    HttpServletRequest request = Mock()
    HttpServletResponse response = Mock()
    RoleRepository roleRepository = Mock()
    SAML2Profile saml2Profile = Mock()
    SecurityContext securityContext = Mock()
    UserService userService = Mock()

    Pac4jConfigurationProperties.SimpleProfileMapping profileMapping

    def setup() {
        SecurityContextHolder.setContext(securityContext)
        securityContext.getAuthentication() >> authentication
        authentication.getPrincipal() >> saml2Profile

        RolesServiceImpl roleService = new RolesServiceImpl().with {
            it.roleRepository = roleRepository
            it
        }

        addNewUserFilter = new AddNewUserFilter(pac4jConfigurationProperties, userService, roleService, new PathMatcher(), groupService, Optional.of(emailService))
        profileMapping = pac4jConfigurationProperties.simpleProfileMapping
    }

    // Checked in AddNewUserFilterTests
    //    def "new users are redirected"()

    def "existing users are not redirected"() {
        given:
        saml2Profile.getUsername() >> "existingUser"
        userService.findByUsername('existingUser') >> Optional.of(new User().with {
            it.username = 'existingUser'
            it.roles = [new Role('ROLE_USER')]
            it
        })

        when:
        addNewUserFilter.doFilter(request, response, chain)

        then:
        0 * roleRepository.save(_)
        0 * userService.save(_)
        1 * chain.doFilter(_, _)
    }
}