package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import net.shibboleth.ext.spring.resource.ResourceHelper
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.core.io.ClassPathResource
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.http.MediaType
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Specification
import spock.lang.Subject

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EntitiesControllerTests extends Specification {
    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def resource = ResourceHelper.of(new ClassPathResource("/metadata/aggregate.xml"))

    def metadataResolver = new ResourceBackedMetadataResolver(resource).with {
        it.id = 'test'
        it.parserPool = openSamlObjects.parserPool
        initialize()
        it
    }

    @Autowired
    UserService userService

    @Subject
    def controller = new EntitiesController(
            openSamlObjects: openSamlObjects,
            entityDescriptorService: new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects), userService),
            metadataResolver: metadataResolver
    )

    def mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

    def 'GET /api/entities/test'() {
        when:
        def result = mockMvc.perform(get("/api/entities/test"))

        then:
        result.andExpect(status().isNotFound())
    }

    def 'GET /api/entities/test XML'() {
        when:
        def result = mockMvc.perform(get("/api/entities/test").header('Accept', 'application/xml'))

        then:
        result.andExpect(status().isNotFound())
    }

    def 'GET /api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1'() {
        given:
        def expectedBody = '''
            {
                "id":null,
                "serviceProviderName":null,
                "entityId":"http://test.scaldingspoon.org/test1",
                "organization":null,
                "contacts":null,
                "mdui":null,
                "serviceProviderSsoDescriptor": {
                    "protocolSupportEnum":"SAML 2",
                    "nameIdFormats":["urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"]
                },
                "logoutEndpoints":null,
                "securityInfo":null,
                "assertionConsumerServices":[
                    {"locationUrl":"https://test.scaldingspoon.org/test1/acs","binding":"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST","makeDefault":false}
                ],
                "serviceEnabled":false,
                "createdDate":null,
                "modifiedDate":null,
                "relyingPartyOverrides":{},
                "attributeRelease":["givenName","employeeNumber"]
            }
        '''
        when:
        def result = mockMvc.perform(get('/api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1'))

        then:
        def x = content()
        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(expectedBody, false))
    }

    def 'GET /api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1 XML'() {
        given:
        def expectedBody = '''<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
  <md:Extensions>
    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>internal</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>givenName</saml:AttributeValue>
        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
      </saml:Attribute>
    </mdattr:EntityAttributes>
  </md:Extensions>
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
'''
        when:
        def result = mockMvc.perform(get('/api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1').header('Accept', 'application/xml'))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType('application/xml;charset=ISO-8859-1'))
                .andExpect(content().xml(expectedBody))
    }
}
