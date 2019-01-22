package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.client.RestTemplate
import spock.lang.Specification
import spock.lang.Subject

import javax.servlet.http.HttpSession
import java.security.Principal
import java.time.LocalDateTime

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EntityDescriptorControllerTests extends Specification {

    RandomGenerator randomGenerator
    TestObjectGenerator generator

    def mapper
    def service

    def entityDescriptorRepository = Mock(EntityDescriptorRepository)
    def mockRestTemplate = Mock(RestTemplate)

    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def mockMvc

    @Subject
    def controller

    Authentication authentication = Mock()
    SecurityContext securityContext = Mock()
    UserRepository userRepository = Mock()
    RoleRepository roleRepository = Mock()

    UserService userService

    def setup() {
        generator = new TestObjectGenerator()
        randomGenerator = new RandomGenerator()
        mapper = new ObjectMapper()

        userService = new UserService(roleRepository, userRepository)
        service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects), userService)

        controller = new EntityDescriptorController(userRepository, roleRepository, userService)
        controller.entityDescriptorRepository =  entityDescriptorRepository
        controller.openSamlObjects = openSamlObjects
        controller.entityDescriptorService = service

        controller.restTemplate = mockRestTemplate
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        securityContext.getAuthentication() >> authentication
    }

    def 'GET /EntityDescriptors with empty repository as admin'() {
        given:
        prepareAdminUser()
        def emptyRecordsFromRepository = [].stream()
        def expectedEmptyListResponseBody = '[]'
        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        //One call to the repo expected
        1 * entityDescriptorRepository.findAllByCustomQueryAndStream() >> emptyRecordsFromRepository
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedEmptyListResponseBody))

    }

    def 'GET /EntityDescriptors with 1 record in repository as admin'() {
        given:
        prepareAdminUser()
        def expectedCreationDate = '2017-10-23T11:11:11'
        def entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate))
        def oneRecordFromRepository = [entityDescriptor].stream()
        def version = entityDescriptor.hashCode()
        def expectedOneRecordListResponseBody = """
            [
              {
	            "id": "uuid-1",
                "serviceProviderName": "sp1",
	            "entityId": "eid1",
	            "serviceEnabled": true,
	            "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
	            "attributeRelease": null,
	            "version": $version,
                "createdBy": null
              }
            ]    
        """

        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        //One call to the repo expected
        1 * entityDescriptorRepository.findAllByCustomQueryAndStream() >> oneRecordFromRepository
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedOneRecordListResponseBody, true))

    }

    def 'GET /EntityDescriptors with 2 records in repository as admin'() {
        given:
        prepareAdminUser()
        def expectedCreationDate = '2017-10-23T11:11:11'
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1',
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate))
        def versionOne = entityDescriptorOne.hashCode()
        def entityDescriptorTwo = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2',
                serviceEnabled: false,
                createdDate: LocalDateTime.parse(expectedCreationDate))
        def versionTwo = entityDescriptorTwo.hashCode()
        def twoRecordsFromRepository = [entityDescriptorOne, entityDescriptorTwo].stream()
        def expectedTwoRecordsListResponseBody = """
           [
              {
	            "id": "uuid-1",
                "serviceProviderName": "sp1",
	            "entityId": "eid1",
	            "serviceEnabled": true,
	            "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null,
                "version": $versionOne,
                "createdBy": null
              },
              {
	            "id": "uuid-2",
	            "serviceProviderName": "sp2",
	            "entityId": "eid2",
	            "serviceEnabled": false,
	            "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null,
                "version": $versionTwo,
                "createdBy": null
              }              
           ]    
        """

        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        //One call to the repo expected
        1 * entityDescriptorRepository.findAllByCustomQueryAndStream() >> twoRecordsFromRepository
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedTwoRecordsListResponseBody, true))

    }

    def 'GET /EntityDescriptors with 1 record in repository as user returns only that user\'s records'() {
        given:
        prepareUser('someUser', 'ROLE_USER')
        def expectedCreationDate = '2017-10-23T11:11:11'
        def entityDescriptorOne = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1',
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate),
                createdBy: 'someUser')
        def versionOne = entityDescriptorOne.hashCode()
        def oneRecordFromRepository = [entityDescriptorOne].stream()
        def expectedOneRecordListResponseBody = """
           [
              {
                "id": "uuid-1",
                "serviceProviderName": "sp1",
                "entityId": "eid1",
                "serviceEnabled": true,
                "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
                "organization": null,
                "contacts": null,
                "mdui": null,
                "serviceProviderSsoDescriptor": null,
                "logoutEndpoints": null,
                "securityInfo": null,
                "assertionConsumerServices": null,
                "relyingPartyOverrides": null,
                "attributeRelease": null,
                "version": $versionOne,
                "createdBy": "someUser"
              }              
           ]    
        """

        def expectedResponseContentType = APPLICATION_JSON_UTF8
        def expectedHttpResponseStatus = status().isOk()

        when:
        def result = mockMvc.perform(get('/api/EntityDescriptors'))

        then:
        //One call to the repo expected
        1 * entityDescriptorRepository.findAllByCreatedBy('someUser') >> oneRecordFromRepository
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(expectedOneRecordListResponseBody, true))
    }

    def 'POST /EntityDescriptor and successfully create new record'() {
        given:
        def expectedCreationDate = '2017-10-23T11:11:11'
        def expectedEntityId = 'https://shib'
        def expectedSpName = 'sp1'
        def expectedUUID = 'uuid-1'
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/EntityDescriptor/$expectedUUID"
        def entityDescriptor = new EntityDescriptor(resourceId: expectedUUID, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate))
        def version = entityDescriptor.hashCode()

        def postedJsonBody = """            
              {	            
	            "serviceProviderName": "$expectedSpName",
	            "entityId": "$expectedEntityId",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": null,
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null
              }                
        """

        def expectedJsonBody = """            
              {
	            "id": "$expectedUUID",
	            "serviceProviderName": "$expectedSpName",
	            "entityId": "$expectedEntityId",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null,
                "version": $version,
                "createdBy": null
              }                
        """

        when:
        def result = mockMvc.perform(
                post('/api/EntityDescriptor')
                    .contentType(APPLICATION_JSON_UTF8)
                    .content(postedJsonBody))

        then:
        //Stub invocation of the repository returning null for non-existent record
        1 * entityDescriptorRepository.findByEntityID(expectedEntityId) >> null

        //Expect 1 invocation of repository save() with correct EntityDescriptor
        1 * entityDescriptorRepository.save({
            it.entityID == expectedEntityId &&
            it.serviceProviderName == expectedSpName &&
            it.serviceEnabled == true
        }) >> entityDescriptor

        result.andExpect(status().isCreated())
                .andExpect(content().json(expectedJsonBody, true))
                .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))

    }

    def 'POST /EntityDescriptor record already exists'() {
        given:
        def expectedEntityId = 'eid1'
        def postedJsonBody = """            
              {
	            "serviceProviderName": "sp1",
	            "entityId": "$expectedEntityId",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": null,
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null
              }                
        """

        when:
        def result = mockMvc.perform(
                post('/api/EntityDescriptor')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        //Stub invocation of the repository returning an existing record
        1 * entityDescriptorRepository.findByEntityID(expectedEntityId) >> new EntityDescriptor(entityID: expectedEntityId)
        result.andExpect(status().isConflict())
    }

    def 'GET /EntityDescriptor/{resourceId} non-existent'() {
        given:
        def providedResourceId = 'uuid-1'

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId"))

        then:
        //No EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> null
        result.andExpect(status().isNotFound())
    }

    def 'GET /EntityDescriptor/{resourceId} existing'() {
        given:
        prepareAdminUser()
        def expectedCreationDate = '2017-10-23T11:11:11'
        def providedResourceId = 'uuid-1'
        def expectedSpName = 'sp1'
        def expectedEntityId = 'eid1'

        def entityDescriptor = new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate))
        def version = entityDescriptor.hashCode()

        def expectedJsonBody = """            
              {
	            "id": "${providedResourceId}",
	            "serviceProviderName": "$expectedSpName",
	            "entityId": "$expectedEntityId",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null,
                "version": $version,
                "createdBy": null
              }                
        """

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId"))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> entityDescriptor


        result.andExpect(status().isOk())
                .andExpect(content().json(expectedJsonBody, true))
    }

    def 'GET /EntityDescriptor/{resourceId} existing, owned by non-admin'() {
        given:
        prepareUser('someUser', 'ROLE_USER')
        def expectedCreationDate = '2017-10-23T11:11:11'
        def providedResourceId = 'uuid-1'
        def expectedSpName = 'sp1'
        def expectedEntityId = 'eid1'

        def entityDescriptor = new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate),
                createdBy: 'someUser')
        def version = entityDescriptor.hashCode()

        def expectedJsonBody = """            
              {
	            "id": "${providedResourceId}",
	            "serviceProviderName": "$expectedSpName",
	            "entityId": "$expectedEntityId",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": "$expectedCreationDate",
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null,
                "version": $version,
                "createdBy": "someUser"
              }                
        """

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId"))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> entityDescriptor


        result.andExpect(status().isOk())
                .andExpect(content().json(expectedJsonBody, true))
    }

    def 'GET /EntityDescriptor/{resourceId} existing, owned by some other user'() {
        given:
        prepareUser('someUser', 'ROLE_USER')
        def expectedCreationDate = '2017-10-23T11:11:11'
        def providedResourceId = 'uuid-1'
        def expectedSpName = 'sp1'
        def expectedEntityId = 'eid1'

        def entityDescriptor = new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate),
                createdBy: 'someOtherUser')

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId"))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> entityDescriptor

        result.andExpect(status().is(403))
    }

    def 'GET /EntityDescriptor/{resourceId} existing (xml)'() {
        given:
        prepareAdminUser()
        def expectedCreationDate = '2017-10-23T11:11:11'
        def providedResourceId = 'uuid-1'
        def expectedSpName = 'sp1'
        def expectedEntityId = 'eid1'

        def entityDescriptor = new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate))
        entityDescriptor.setElementLocalName("EntityDescriptor")
        entityDescriptor.setNamespacePrefix("md")
        entityDescriptor.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")

        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor
	xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="$expectedEntityId"/>"""

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId")
                .accept(APPLICATION_XML))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> entityDescriptor


        result.andExpect(status().isOk())
            .andExpect(content().xml(expectedXML))
    }

    def 'GET /EntityDescriptor/{resourceId} existing (xml), user-owned'() {
        given:
        prepareUser('someUser', 'ROLE_USER')
        def expectedCreationDate = '2017-10-23T11:11:11'
        def providedResourceId = 'uuid-1'
        def expectedSpName = 'sp1'
        def expectedEntityId = 'eid1'

        def entityDescriptor = new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate),
                createdBy: 'someUser')
        entityDescriptor.setElementLocalName("EntityDescriptor")
        entityDescriptor.setNamespacePrefix("md")
        entityDescriptor.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")

        def expectedXML = """<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor
	xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="$expectedEntityId"/>"""

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId")
                .accept(APPLICATION_XML))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> entityDescriptor


        result.andExpect(status().isOk())
                .andExpect(content().xml(expectedXML))
   }

    def 'GET /EntityDescriptor/{resourceId} existing (xml), other user-owned'() {
        given:
        prepareUser('someUser', 'ROLE_USER')
        def expectedCreationDate = '2017-10-23T11:11:11'
        def providedResourceId = 'uuid-1'
        def expectedSpName = 'sp1'
        def expectedEntityId = 'eid1'

        def entityDescriptor = new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate),
                createdBy: 'someOtherUser')
        entityDescriptor.setElementLocalName("EntityDescriptor")
        entityDescriptor.setNamespacePrefix("md")
        entityDescriptor.setNamespaceURI("urn:oasis:names:tc:SAML:2.0:metadata")

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId")
                .accept(APPLICATION_XML))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >> entityDescriptor

        result.andExpect(status().is(403))
    }

    def "POST /EntityDescriptor handles XML happily"() {
        given:
        prepareAdminUser()
        def postedBody = '''<?xml version="1.0" encoding="UTF-8"?>
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
        def spName = randomGenerator.randomString()

        def expectedEntityDescriptor = EntityDescriptor.class.cast(openSamlObjects.unmarshalFromXml(postedBody.bytes))

        1 * entityDescriptorRepository.findByEntityID(_) >> null
        1 * entityDescriptorRepository.save(_) >> expectedEntityDescriptor

        def expectedJson = """
{
	"version": ${expectedEntityDescriptor.hashCode()},
	"id": "${expectedEntityDescriptor.resourceId}",
	"serviceProviderName": null,
	"entityId": "http://test.scaldingspoon.org/test1",
	"organization": null,
	"contacts": null,
	"mdui": null,
	"serviceProviderSsoDescriptor": {
		"protocolSupportEnum": "SAML 2",
		"nameIdFormats": [
			"urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
		]
	},
	"logoutEndpoints": null,
	"securityInfo": null,
	"assertionConsumerServices": [
		{
			"locationUrl": "https://test.scaldingspoon.org/test1/acs",
			"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
			"makeDefault": false
		}
	],
	"serviceEnabled": false,
	"createdDate": null,
	"modifiedDate": null,
	"relyingPartyOverrides": {},
	"attributeRelease": [
		"givenName",
		"employeeNumber"
	],
    "createdBy": null
}
"""

        when:
        def result = mockMvc.perform(post("/api/EntityDescriptor")
                .contentType(APPLICATION_XML)
                .content(postedBody)
                .param("spName", spName))


        then:
        result.andExpect(status().isCreated())
            .andExpect(content().json(expectedJson, true))
    }

    def "POST /EntityDescriptor returns error for duplicate entity id"() {
        given:
        def postedBody = '''<?xml version="1.0" encoding="UTF-8"?>
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
        def spName = randomGenerator.randomString()

        def expectedEntityDescriptor = EntityDescriptor.class.cast(openSamlObjects.unmarshalFromXml(postedBody.bytes))

        1 * entityDescriptorRepository.findByEntityID(expectedEntityDescriptor.entityID) >> expectedEntityDescriptor
        0 * entityDescriptorRepository.save(_)

        when:
        def result = mockMvc.perform(post("/api/EntityDescriptor")
                .contentType(APPLICATION_XML)
                .content(postedBody)
                .param("spName", spName))


        then:
        result.andExpect(status().isConflict())
                .andExpect(content().string("{\"errorCode\":\"409\",\"errorMessage\":\"The entity descriptor with entity id [http://test.scaldingspoon.org/test1] already exists.\"}"))
    }

    def "POST /EntityDescriptor handles x-www-form-urlencoded happily"() {
        given:
        prepareAdminUser()
        def postedMetadataUrl = "http://test.scaldingspoon.org/test1"
        def restXml = '''<?xml version="1.0" encoding="UTF-8"?>
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

        def spName = randomGenerator.randomString()

        def expectedEntityDescriptor = EntityDescriptor.class.cast(openSamlObjects.unmarshalFromXml(restXml.bytes))

        1 * mockRestTemplate.getForObject(_, _) >> restXml.bytes
        1 * entityDescriptorRepository.findByEntityID(_) >> null
        1 * entityDescriptorRepository.save(_) >> expectedEntityDescriptor

        def expectedJson = """
{
	"version": ${expectedEntityDescriptor.hashCode()},
	"id": "${expectedEntityDescriptor.resourceId}",
	"serviceProviderName": null,
	"entityId": "http://test.scaldingspoon.org/test1",
	"organization": null,
	"contacts": null,
	"mdui": null,
	"serviceProviderSsoDescriptor": {
		"protocolSupportEnum": "SAML 2",
		"nameIdFormats": [
			"urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
		]
	},
	"logoutEndpoints": null,
	"securityInfo": null,
	"assertionConsumerServices": [
		{
			"locationUrl": "https://test.scaldingspoon.org/test1/acs",
			"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
			"makeDefault": false
		}
	],
	"serviceEnabled": false,
	"createdDate": null,
	"modifiedDate": null,
	"relyingPartyOverrides": {},
	"attributeRelease": [
		"givenName",
		"employeeNumber"
	],
    "createdBy": null
}
"""

        when:
        def result = mockMvc.perform(post("/api/EntityDescriptor")
                .contentType(APPLICATION_FORM_URLENCODED)
                .param("metadataUrl", postedMetadataUrl)
                .param("spName", spName))


        then:
        result.andExpect(status().isCreated())
                .andExpect(content().json(expectedJson, true))
    }

    def "PUT /EntityDescriptor updates entity descriptors properly as admin"() {
        given:
        prepareAdminUser()
        def entityDescriptor = generator.buildEntityDescriptor()
        def updatedEntityDescriptor = generator.buildEntityDescriptor()
        updatedEntityDescriptor.resourceId = entityDescriptor.resourceId
        def updatedEntityDescriptorRepresentation = service.createRepresentationFromDescriptor(updatedEntityDescriptor)
        updatedEntityDescriptorRepresentation.version = entityDescriptor.hashCode()
        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)

        def resourceId = entityDescriptor.resourceId

        1 * entityDescriptorRepository.findByResourceId(resourceId) >> entityDescriptor
        1 * entityDescriptorRepository.save(_) >> updatedEntityDescriptor

        when:
        def result = mockMvc.perform(
                put("/api/EntityDescriptor/$resourceId")
                .contentType(APPLICATION_JSON_UTF8)
                .content(postedJsonBody))

        then:
        def expectedJson = new JsonSlurper().parseText(postedJsonBody)
        expectedJson << [version: updatedEntityDescriptor.hashCode()]
        result.andExpect(status().isOk())
                .andExpect(content().json(JsonOutput.toJson(expectedJson), true))
    }

    def "PUT /EntityDescriptor denies the request if the PUTing user is not an ADMIN and not the createdBy user"() {
        given:
        prepareUser('randomUser', 'ROLE_USER')
        def entityDescriptor = generator.buildEntityDescriptor()
        entityDescriptor.createdBy = 'someoneElse'
        def updatedEntityDescriptor = generator.buildEntityDescriptor()
        updatedEntityDescriptor.createdBy = 'someoneElse'
        updatedEntityDescriptor.resourceId = entityDescriptor.resourceId
        def updatedEntityDescriptorRepresentation = service.createRepresentationFromDescriptor(updatedEntityDescriptor)
        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)
        def resourceId = entityDescriptor.resourceId
        1 * entityDescriptorRepository.findByResourceId(resourceId) >> entityDescriptor

        when:
        def result = mockMvc.perform(
                put("/api/EntityDescriptor/$resourceId")
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().is(403))
    }

    def "PUT /EntityDescriptor 409's if the version numbers don't match"() {
        given:
        prepareAdminUser()
        def entityDescriptor = generator.buildEntityDescriptor()
        def updatedEntityDescriptor = generator.buildEntityDescriptor()
        updatedEntityDescriptor.resourceId = entityDescriptor.resourceId
        def updatedEntityDescriptorRepresentation = service.createRepresentationFromDescriptor(updatedEntityDescriptor)
        def postedJsonBody = mapper.writeValueAsString(updatedEntityDescriptorRepresentation)

        def resourceId = entityDescriptor.resourceId

        1 * entityDescriptorRepository.findByResourceId(resourceId) >> entityDescriptor

        when:
        def result = mockMvc.perform(
                put("/api/EntityDescriptor/$resourceId")
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().is(409))
    }

    def prepareAdminUser() {
        prepareUser('foo', 'ROLE_ADMIN')
    }

    def prepareUser(String username, String rolename) {
        authentication.getPrincipal() >> username
        SecurityContextHolder.setContext(securityContext)
        def user = new User(username: username, role: rolename)
        Optional<User> currentUser = Optional.of(user)
        userRepository.findByUsername(username) >> currentUser
    }
}
