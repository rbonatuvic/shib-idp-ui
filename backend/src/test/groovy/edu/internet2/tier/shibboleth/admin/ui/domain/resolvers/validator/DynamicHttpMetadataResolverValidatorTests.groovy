package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator

import edu.internet2.tier.shibboleth.admin.ui.configuration.*
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration, TestMetadataResolverValidationConfiguration, LocalConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ActiveProfiles(["dh-test"])
class DynamicHttpMetadataResolverValidatorTests extends Specification {
    @Autowired
    GroupServiceForTesting groupServiceForTesting

    @Autowired
    @Qualifier("metadataResolverValidationService")
    MetadataResolverValidationService metadataResolverValidationService

    @Autowired
    RoleRepository roleRepository

    @Autowired
    UserRepository userRepository

    @Autowired
    UserService userService

    @Transactional
    def setup() {
        userRepository.deleteAll()
        roleRepository.deleteAll()
        groupServiceForTesting.clearAllForTesting()

        Group g = new Group()
        g.setResourceId("shib")
        g.setName("shib")
        // This is valid for a url with "shib.org" in it
        g.setValidationRegex("^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$")
        g = groupServiceForTesting.createGroup(g)

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

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo", group: g)
        userService.save(user)
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
    @Rollback
    def "test validation by service works properly"() {
        given:
        DynamicHttpMetadataResolver metadataResolver = new DynamicHttpMetadataResolver()
        MetadataQueryProtocolScheme scheme = new MetadataQueryProtocolScheme()
        scheme.setContent("http://foo.shib.org/bar")
        metadataResolver.setMetadataRequestURLConstructionScheme(scheme)

        when:
        IMetadataResolverValidator.ValidationResult result = metadataResolverValidationService.validateIfNecessary(metadataResolver)

        then:
        result.isValid()

        when: "using a bad url (no match)"
        metadataResolver.getMetadataRequestURLConstructionScheme().setContent("http://foo.shib.com/bar")
        result = metadataResolverValidationService.validateIfNecessary(metadataResolver)

        then:
        !result.isValid()
    }

    @org.springframework.boot.test.context.TestConfiguration
    @Profile("dh-test")
    static class LocalConfig {
        @Bean
        @Primary
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