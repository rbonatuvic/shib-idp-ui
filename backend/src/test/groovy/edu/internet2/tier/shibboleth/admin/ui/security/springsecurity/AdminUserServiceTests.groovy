package edu.internet2.tier.shibboleth.admin.ui.security.springsecurity

import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * Tests for <code>AdminUserService</code> (well, really it tests that the DevConfig worked as much as anything)
 *
 * @author Dmitriy Kopylenko
 */
@SpringBootTest
@ActiveProfiles('dev')
class AdminUserServiceTests extends Specification {

    @Autowired
    AdminUserService adminUserService

    def "Loading existing admin user with admin role"() {
        given: 'Valid user with admin role is available (loaded by Spring Boot Listener in dev profile)'
        def user = adminUserService.loadUserByUsername('admin')

        expect:
        user.username == 'admin'
        user.password == '{noop}adminpass'
        user.getAuthorities().size() == 1
        user.getAuthorities()[0].authority == 'ROLE_ADMIN'
        user.enabled
        user.accountNonExpired
        user.credentialsNonExpired
    }

    def "Loading NON-existing admin user with admin role"() {
        when: 'Non-existent admin user is tried to be looked up'
        adminUserService.loadUserByUsername('nonexisting')

        then:
        thrown UsernameNotFoundException
    }
}
