package edu.internet2.tier.shibboleth.admin.ui.service

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.JsonSchemaComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.LowLevelJsonSchemaValidator
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import org.springframework.core.io.DefaultResourceLoader
import org.springframework.core.io.ResourceLoader
import org.springframework.mock.http.MockHttpInputMessage
import spock.lang.Shared
import spock.lang.Specification

import java.time.LocalDateTime

class AuxiliaryIntegrationTests extends Specification {
    @Shared
    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        it.init()
        it
    }

    @Shared
    EntityDescriptorService entityDescriptorService

    @Shared
    ObjectMapper objectMapper

    @Shared
    ResourceLoader resourceLoader

    void setup() {
        this.entityDescriptorService = new JPAEntityDescriptorServiceImpl(openSamlObjects, null, null)
        this.objectMapper = new ObjectMapper()
        this.resourceLoader = new DefaultResourceLoader()
    }

    def "SHIBUI-1723: after enabling saved entity descriptor, it should still have valid xml"() {
        given:
        def entityDescriptor = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-1723-1.xml').bytes) as EntityDescriptor
        def entityDescriptorRepresentation = this.entityDescriptorService.createRepresentationFromDescriptor(entityDescriptor).with {
            it.serviceProviderName = 'testme'
            it.contacts = []
            it.securityInfo.x509Certificates[0].name = 'testcert'
            it.createdBy = 'root'
            it.setCreatedDate(LocalDateTime.now())
            it.setModifiedDate(LocalDateTime.now())
            it
        }
        def json = this.objectMapper.writeValueAsString(entityDescriptorRepresentation)
        def schemaUri = edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSchema(new JsonSchemaComponentsConfiguration().jsonSchemaResourceLocationRegistry(this.resourceLoader, this.objectMapper)).uri

        when:
        LowLevelJsonSchemaValidator.validatePayloadAgainstSchema(new MockHttpInputMessage(json.bytes), schemaUri)

        then:
        noExceptionThrown()
    }
}
