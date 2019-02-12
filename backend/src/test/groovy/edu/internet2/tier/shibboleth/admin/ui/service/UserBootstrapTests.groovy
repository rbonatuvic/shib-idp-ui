package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.core.io.ClassPathResource
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration, ShibUIConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan(["edu.internet2.tier.shibboleth.admin.ui", "edu.internet2.tier.shibboleth.admin.ui.security.model"])
@DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
class UserBootstrapTests extends Specification {
    @Autowired
    ShibUIConfiguration shibUIConfiguration

    @Autowired
    UserRepository userRepository

    @Autowired
    RoleRepository roleRepository

    def "simple test"() {
        setup:
        userRepository.deleteAll()
        roleRepository.deleteAll()
        shibUIConfiguration.userBootstrapResource = new ClassPathResource('/conf/1044.csv')
        def userBootstrap = new UserBootstrap(shibUIConfiguration, userRepository, roleRepository)

        when:
        userBootstrap.bootstrapUsersAndRoles(null)

        then:
        noExceptionThrown()
        assert userRepository.findAll().size() == 2
        assert roleRepository.findAll().size() == 2
    }

    def "bootstrap roles"() {
        setup:
        userRepository.deleteAll()
        roleRepository.deleteAll()
        shibUIConfiguration.roles = ['ROLE_ADMIN', 'ROLE_USER']
        def userbootstrap = new UserBootstrap(shibUIConfiguration, userRepository, roleRepository)

        when:
        userbootstrap.bootstrapUsersAndRoles(null)

        then:
        noExceptionThrown()
        assert roleRepository.findAll().size() == 3
        assert roleRepository.findByName('ROLE_ADMIN').get()
        assert roleRepository.findByName('ROLE_USER').get()
    }
}
