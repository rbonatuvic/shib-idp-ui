package net.unicon.shibui.pac4j

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService

import org.pac4j.core.matching.matcher.PathMatcher
import org.pac4j.core.profile.CommonProfile
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
import javax.servlet.ServletRequest
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@SpringBootTest(classes = [Pac4jConfigurationProperties])
@EnableConfigurationProperties([Pac4jConfigurationProperties])
class AddNewUserFilterTests extends Specification {

    UserRepository userRepository = Mock()
    RoleRepository roleRepository = Mock()
    EmailService emailService = Mock()

    HttpServletRequest request = Mock()
    HttpServletResponse response = Mock()
    FilterChain chain = Mock()

    SecurityContext securityContext = Mock()
    Authentication authentication = Mock()
    SAML2Profile saml2Profile = Mock()

    @Autowired
    Pac4jConfigurationProperties pac4jConfigurationProperties

    Pac4jConfigurationProperties.SimpleProfileMapping profileMapping

    @Subject
    AddNewUserFilter addNewUserFilter

    def setup() {
        SecurityContextHolder.setContext(securityContext)
        securityContext.getAuthentication() >> authentication
        authentication.getPrincipal() >> saml2Profile

        addNewUserFilter = new AddNewUserFilter(pac4jConfigurationProperties, userRepository, roleRepository, new PathMatcher(), Optional.of(emailService))
        profileMapping = pac4jConfigurationProperties.simpleProfileMapping
    }

    def "new users are redirected"() {
        given:
        ['Username': 'newUser',
         'FirstName': 'New',
         'LastName': 'User',
         'Email': 'newuser@institution.edu'].each { key, value ->
            saml2Profile.getAttribute(profileMapping."get${key}"()) >> [value]
        }
        saml2Profile.getUsername() >> "newUser"
        userRepository.findByUsername('newUser') >> Optional.empty()
        roleRepository.findByName('ROLE_NONE') >> Optional.of(new Role('ROLE_NONE'))

        when:
        addNewUserFilter.doFilter(request, response, chain)

        then:
        0 * roleRepository.save(_)
        1 * userRepository.save(_ as User) >> { User user -> user }
        1 * emailService.sendNewUserMail('newUser')
        1 * response.sendRedirect("/unsecured/error.html")
    }

    def "existing users are not redirected"() {
        given:
        saml2Profile.getUsername() >> "existingUser"
        userRepository.findByUsername('existingUser') >> Optional.of(new User().with {
            it.username = 'existingUser'
            it.roles = [new Role('ROLE_USER')]
            it
        })

        when:
        addNewUserFilter.doFilter(request, response, chain)

        then:
        0 * roleRepository.save(_)
        0 * userRepository.save(_)
        1 * chain.doFilter(_, _)
    }
}
