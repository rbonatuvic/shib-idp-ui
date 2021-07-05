package edu.internet2.tier.shibboleth.admin.ui.service

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.ShibbolethUiApplication
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.XSAny
import edu.internet2.tier.shibboleth.admin.ui.domain.XSAnyBuilder
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBooleanBuilder
import edu.internet2.tier.shibboleth.admin.ui.domain.XSStringBuilder
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.opensaml.saml.ext.saml2mdattr.EntityAttributes
import org.skyscreamer.jsonassert.JSONAssert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.json.JacksonTester
import org.springframework.context.annotation.PropertySource
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ContextConfiguration
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import org.xmlunit.diff.DefaultNodeMatcher
import org.xmlunit.diff.ElementSelectors
import spock.lang.Specification

@ContextConfiguration(classes=[CoreShibUiConfiguration, CustomPropertiesConfiguration])
@SpringBootTest(classes = ShibbolethUiApplication.class, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@PropertySource("classpath:application.yml")
class JPAEntityDescriptorServiceImplTests2 extends Specification {

    @Autowired
    JPAEntityDescriptorServiceImpl service

    @Autowired
    UserRepository userRepository

    @Autowired
    IGroupService groupService

    @Autowired
    UserService userService
        
    def setup() {       
        Group ga = new Group()
        ga.setResourceId("testingGroup")
        ga.setName("Group A")
        ga.setDefaultGroup(true)
        
        Group.DEFAULT_GROUP = ga
        
        Group gb = new Group();
        gb.setResourceId("testingGroupBBB")
        gb.setName("Group BBB")
        groupService.createGroup(gb)
        
        User u = new User()
        u.setUsername("foo")
        u.setGroup(gb)
        u.setPassword("pass")
        userRepository.save(u)
    }

    @WithMockUser(value = "foo", roles = ["USER"])
    def "When creating Entity Descriptor, ED is assigned to the user's group"() {
        given:
        User current = userService.getCurrentUser()
        current.setGroupId("testingGroupBBB")

        def expectedCreationDate = '2017-10-23T11:11:11'
        def expectedEntityId = 'https://shib'
        def expectedSpName = 'sp1'
        def expectedUUID = 'uuid-1'
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/EntityDescriptor/$expectedUUID"
        def entityDescriptor = new EntityDescriptor(resourceId: expectedUUID, entityID: expectedEntityId, serviceProviderName: expectedSpName, serviceEnabled: false)
        
        when:
        def result = service.createNew(entityDescriptor)
        
        then:
        ((EntityDescriptorRepresentation)result).getGroupId() == "testingGroupBBB"
    }
}
