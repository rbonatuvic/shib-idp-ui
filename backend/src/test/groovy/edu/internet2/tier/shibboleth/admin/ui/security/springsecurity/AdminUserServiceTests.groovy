package edu.internet2.tier.shibboleth.admin.ui.security.springsecurity

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.DevConfig
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration

/**
 * Tests for <code>AdminUserService</code> (well, really it tests that the DevConfig worked as much as anything)
 *
 * @author Dmitriy Kopylenko
 */
@ContextConfiguration(classes=[AUSLocalConfig])
class AdminUserServiceTests extends AbstractBaseDataJpaTest {
    @Autowired
    AdminUserService adminUserService

    @Autowired
    DevConfig devConfig

    def setup() {
        // db is cleaned by test setup, so we have to re-run before each test
        devConfig.createDevUsersAndGroups()
    }

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

    @Override
    protected createAdminUser() {
        // Do nothing so that the dev config will create the admin user rather than the test setup
    }

    @TestConfiguration
    private static class AUSLocalConfig {
        @Bean
        AdminUserService adminUserService(UserRepository userRepository) {
            return new AdminUserService(userRepository)
        }

        // Rather than having a specific dev context needed, we just stand up the needed bean.
        @Bean
        DevConfig devConfig(UserRepository adminUserRepository, GroupsRepository groupsRepository, IGroupService groupService,
                            MetadataResolverRepository metadataResolverRepository, OpenSamlObjects openSamlObjects, UserService userService,
                            RoleRepository roleRepository, EntityDescriptorRepository entityDescriptorRepository) {
            DevConfig dc =  new DevConfig( adminUserRepository, groupsRepository, metadataResolverRepository, roleRepository,
                                           entityDescriptorRepository, openSamlObjects, groupService).with {
                it.userService = userService
                it
            }
            return dc
        }
    }
}