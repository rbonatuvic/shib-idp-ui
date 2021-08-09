package edu.internet2.tier.shibboleth.admin.ui.service

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.JsonSchemaComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.LowLevelJsonSchemaValidator
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group

import org.springframework.core.io.DefaultResourceLoader
import org.springframework.core.io.ResourceLoader
import org.springframework.mock.http.MockHttpInputMessage
import spock.lang.Shared
import spock.lang.Specification

import java.time.LocalDateTime

class AuxiliaryIntegrationTests extends Specification {
    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        it.init()
        it
    }

    JPAEntityDescriptorServiceImpl entityDescriptorService
    ObjectMapper objectMapper
    ResourceLoader resourceLoader

    void setup() {
        entityDescriptorService = new JPAEntityDescriptorServiceImpl()
        entityDescriptorService.openSamlObjects = openSamlObjects
        objectMapper = new ObjectMapper()
        resourceLoader = new DefaultResourceLoader()
    }

    def "SHIBUI-1723: after enabling saved entity descriptor, it should still have valid xml"() {
        given:
        def group = new Group().with { 
            it.name = "foo"
            it.resourceId = "foo"
            it
        }
        def entityDescriptor = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-1723-1.xml').bytes) as EntityDescriptor
        entityDescriptor.idOfOwner = "foo"
        
        def entityDescriptorRepresentation = entityDescriptorService.createRepresentationFromDescriptor(entityDescriptor).with {
            it.serviceProviderName = 'testme'
            it.contacts = []
            it.securityInfo.x509Certificates[0].name = 'testcert'
            it.createdBy = 'root'
            it.setCreatedDate(LocalDateTime.now())
            it.setModifiedDate(LocalDateTime.now())
            it
        }
        def json = objectMapper.writeValueAsString(entityDescriptorRepresentation)
        def schemaUri = edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSchema(new JsonSchemaComponentsConfiguration().jsonSchemaResourceLocationRegistry(this.resourceLoader, this.objectMapper)).uri

        when:
        LowLevelJsonSchemaValidator.validatePayloadAgainstSchema(new MockHttpInputMessage(json.bytes), schemaUri)

        then:
        noExceptionThrown()
    }
}
