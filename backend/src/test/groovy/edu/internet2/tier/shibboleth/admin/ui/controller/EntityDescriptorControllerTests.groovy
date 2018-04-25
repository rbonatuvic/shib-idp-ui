package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Specification
import spock.lang.Subject

import java.time.LocalDateTime

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

class EntityDescriptorControllerTests extends Specification {


    def entityDescriptorRepository = Mock(EntityDescriptorRepository)

    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    @Subject
    def controller = new EntityDescriptorController (
            entityDescriptorRepository: entityDescriptorRepository,
            openSamlObjects: openSamlObjects,
            entityDescriptorService: new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects))
    )


    def mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

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
        def oneRecordFromRepository =
                [new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: true,
                        createdDate: LocalDateTime.parse(expectedCreationDate))].stream()
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
	            "attributeRelease": null
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
        def twoRecordsFromRepository = [new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1',
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate)),
                                        new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2',
                                                serviceEnabled: false,
                                                createdDate: LocalDateTime.parse(expectedCreationDate))].stream()
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
                "attributeRelease": null
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
                "attributeRelease": null
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
                "attributeRelease": null
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
        }) >> new EntityDescriptor(resourceId: expectedUUID, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                serviceEnabled: true,
                createdDate: LocalDateTime.parse(expectedCreationDate))

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
                "attributeRelease": null
              }                
        """

        when:
        def result = mockMvc.perform(get("/api/EntityDescriptor/$providedResourceId"))

        then:
        //EntityDescriptor found
        1 * entityDescriptorRepository.findByResourceId(providedResourceId) >>
                new EntityDescriptor(resourceId: providedResourceId, entityID: expectedEntityId, serviceProviderName: expectedSpName,
                        serviceEnabled: true,
                        createdDate: LocalDateTime.parse(expectedCreationDate))

        result.andExpect(status().isOk())
                .andExpect(content().json(expectedJsonBody, true))
    }
}
