package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.FilterType
import org.springframework.core.io.ClassPathResource
import org.springframework.transaction.annotation.Transactional

@ComponentScan(excludeFilters = [@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = [UserBootstrap])])
class UserBootstrapTests extends AbstractBaseDataJpaTest {
    @Autowired
    ShibUIConfiguration shibUIConfiguration

    @Transactional
    def setup() {
        roleRepository.deleteAll()
        userRepository.deleteAll()
        entityManager.flush()
    }
    
    def "simple test"() {
        setup:
        shibUIConfiguration.roles = []
        shibUIConfiguration.userBootstrapResource = new ClassPathResource('/conf/1044.csv')
        def userBootstrap = new UserBootstrap(shibUIConfiguration, userRepository, roleRepository, userService, groupService)

        when:
        userBootstrap.bootstrapUsersAndRoles(null)

        then:
        noExceptionThrown()
        assert userRepository.findAll().size() == 2
        assert roleRepository.findAll().size() == 2
    }

    def "bootstrap roles"() {
        setup:
        shibUIConfiguration.roles = ['ROLE_ADMIN', 'ROLE_USER']
        def userbootstrap = new UserBootstrap(shibUIConfiguration, userRepository, roleRepository, userService, groupService)

        when:
        userbootstrap.bootstrapUsersAndRoles(null)

        then:
        noExceptionThrown()
        assert roleRepository.findAll().size() == 2
        assert roleRepository.findByName('ROLE_ADMIN').get()
        assert roleRepository.findByName('ROLE_USER').get()
    }
}