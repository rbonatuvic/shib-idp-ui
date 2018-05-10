package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Specification
import spock.lang.Subject

import java.time.LocalDateTime

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

class EntityDescriptorControllerTests extends Specification {

    def generator
    def mapper
    def service

    def entityDescriptorRepository = Mock(EntityDescriptorRepository)

    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def mockMvc

    @Subject
    def controller

    def setup() {
        generator = new TestObjectGenerator()
        mapper = new ObjectMapper()
        service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects))

        controller = new EntityDescriptorController (
                entityDescriptorRepository: entityDescriptorRepository,
                openSamlObjects: openSamlObjects,
                entityDescriptorService: service
        )

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }


    def 'GET /EntityDescriptors with empty repository'() {
        given:
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

    def 'GET /EntityDescriptors with 1 record in repository'() {
        given:
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
	            "version": $version
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

    def 'GET /EntityDescriptors with 2 records in repository'() {
        given:
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
                "version": $versionOne
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
                "version": $versionTwo
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
                "version": $version
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
                "version": $version
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

    def "PUT /EntityDescriptor updates entity descriptors properly"() {
        given:
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

    def "PUT /EntityDescriptor 409's if the version numbers don't match"() {
        given:
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
}
