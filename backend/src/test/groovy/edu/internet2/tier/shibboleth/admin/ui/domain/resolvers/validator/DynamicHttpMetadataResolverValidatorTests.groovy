package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverValidationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional

@ContextConfiguration(classes = [MetadataResolverValidationConfiguration])
class DynamicHttpMetadataResolverValidatorTests extends AbstractBaseDataJpaTest {
    @Autowired
    GroupServiceForTesting groupServiceForTesting

    @Autowired
    MetadataResolverValidationService metadataResolverValidationService

    @Transactional
    def setup() {
        Group g = new Group()
        g.setResourceId("shib")
        g.setName("shib")
        // This is valid for a url with "shib.org" in it
        g.setValidationRegex("^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$")
        g = groupServiceForTesting.createGroup(g)

        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo", group: g)
        userService.save(user)
    }

    @WithMockUser(value = "someUser", roles = ["USER"])
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
}