package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import net.shibboleth.ext.spring.resource.ResourceHelper
import net.shibboleth.utilities.java.support.resolver.CriteriaSet
import org.opensaml.core.criterion.EntityIdCriterion
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Subject

import static org.hamcrest.Matchers.is
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class EntitiesControllerTests extends AbstractBaseDataJpaTest {
    @Autowired
    JPAEntityDescriptorServiceImpl serviceImpl

    // Yeah, the setup here is dumb, but the order here is important and we don't need to repeat it, so leave all this alone
    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        it.init()
        it
    }

    def resource = ResourceHelper.of(new ClassPathResource("/metadata/aggregate.xml"))

    def metadataResolver = new ResourceBackedMetadataResolver(resource).with {
        it.id = 'test'
        it.parserPool = openSamlObjects.parserPool
        initialize()
        it
    }

    // This stub will spit out the results from the resolver instead of actually finding them in the DB
    @SpringBean
    EntityDescriptorRepository edr =  Stub(EntityDescriptorRepository) {
        findByEntityID("http://test.scaldingspoon.org/test1") >> metadataResolver.resolveSingle(new CriteriaSet(new EntityIdCriterion("http://test.scaldingspoon.org/test1")))
        findByEntityID("test") >> metadataResolver.resolveSingle(new CriteriaSet(new EntityIdCriterion("test")))
    }
        
    @Subject
    def controller 
    def mockMvc

    def setup() {
        controller = new EntitiesController()
        controller.openSamlObjects = openSamlObjects
        controller.entityDescriptorService = serviceImpl
        controller.entityDescriptorRepository = edr
        
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }
    
    def 'GET /api/entities/test'() {
        when:
        def result = mockMvc.perform(get("/api/entities/test"))

        then:
        result.andExpect(status().isNotFound())
    }

    def 'GET /entities/test'() {
        when:
        def result = mockMvc.perform(get("/entities/test"))

        then:
        result.andExpect(status().isNotFound())
    }
    
    def 'GET /api/entities/test XML'() {
        when:
        def result = mockMvc.perform(get("/api/entities/test").header('Accept', 'application/xml'))

        then:
        result.andExpect(status().isNotFound())
    }

    def 'GET /entities/test XML'() {
        when:
        def result = mockMvc.perform(get("/entities/test").header('Accept', 'application/xml'))

        then:
        result.andExpect(status().isNotFound())
    }

    def 'GET /api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1'() {
        when:
        def result = mockMvc.perform(get('/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1'))

        then:
        // Response headers section 2.5
        // from the spec https://www.ietf.org/archive/id/draft-young-md-query-14.txt
        result.andExpect(status().isOk())
              .andExpect(header().exists(HttpHeaders.CONTENT_TYPE))     // MUST HAVE
//              .andExpect(header().exists(HttpHeaders.CONTENT_LENGTH)) // SHOULD HAVE - should end up from etag filter, so skipped for test
//              .andExpect(header().exists(HttpHeaders.CACHE_CONTROL))  // SHOULD HAVE - should be included by Spring Security               
//              .andExpect(header().exists(HttpHeaders.ETAG))           // MUST HAVE - is done by filter, so skipped for test  
              .andExpect(header().exists(HttpHeaders.LAST_MODIFIED))
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(jsonPath('$.entityId', is("http://test.scaldingspoon.org/test1")))
    }

    def 'GET /entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1'() {
        when:
        def result = mockMvc.perform(get('/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1'))

        then:
        // Response headers section 2.5
        // from the spec https://www.ietf.org/archive/id/draft-young-md-query-14.txt
        result.andExpect(status().isOk())
              .andExpect(header().exists(HttpHeaders.CONTENT_TYPE))     // MUST HAVE
//              .andExpect(header().exists(HttpHeaders.CONTENT_LENGTH)) // SHOULD HAVE - should end up from etag filter, so skipped for test
//              .andExpect(header().exists(HttpHeaders.CACHE_CONTROL))  // SHOULD HAVE - should be included by Spring Security
//              .andExpect(header().exists(HttpHeaders.ETAG))           // MUST HAVE - is done by filter, so skipped for test  
              .andExpect(header().exists(HttpHeaders.LAST_MODIFIED))
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(jsonPath('$.entityId').value("http://test.scaldingspoon.org/test1"))
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
    
    def 'GET /entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1 XML'() {
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
        def result = mockMvc.perform(get('/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1').header('Accept', 'application/xml'))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType('application/xml;charset=ISO-8859-1'))
                .andExpect(content().xml(expectedBody))
    }
}