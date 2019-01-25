package net.unicon.shibui.pac4j

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import spock.lang.Specification
import spock.lang.Subject

import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class AddNewUserFilterTests extends Specification {

    UserRepository userRepository = Mock()
    RoleRepository roleRepository = Mock()
    EmailService emailService = Mock()

    ServletRequest request = Mock()
    HttpServletResponse response = Mock()
    FilterChain chain = Mock()

    SecurityContext securityContext = Mock()
    Authentication authentication = Mock()

    @Subject
    AddNewUserFilter addNewUserFilter = new AddNewUserFilter(userRepository, roleRepository, emailService)

    def setup() {
        SecurityContextHolder.setContext(securityContext)
        securityContext.getAuthentication() >> authentication
    }

    def "new users are redirected"() {
        given:
        authentication.getName() >> 'newUser'
        userRepository.findByUsername('newUser') >> Optional.empty()
        roleRepository.findByName('ROLE_NONE') >> Optional.of(new Role('ROLE_NONE'))

        when:
        addNewUserFilter.doFilter(request, response, chain)

        then:
        1 * roleRepository.save(_)
        1 * userRepository.save(_)
        1 * emailService.sendNewUserMail('newUser')
        1 * response.sendRedirect("/unsecured/error.html")
    }

    def "existing users are not redirected"() {
        given:
        authentication.getName() >> 'existingUser'
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
