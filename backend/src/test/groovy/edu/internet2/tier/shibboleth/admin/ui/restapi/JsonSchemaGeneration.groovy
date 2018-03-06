package edu.internet2.tier.shibboleth.admin.ui.restapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.kjetland.jackson.jsonSchema.JsonSchemaGenerator
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation

import spock.lang.Specification

import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT

class JsonSchemaGeneration extends Specification {

    /*def setupSpec() {
        def om = new ObjectMapper().with {it.enable(INDENT_OUTPUT); it}
        def schemaGenerator = new JsonSchemaGenerator(om)
        def jsonSchema = schemaGenerator.generateJsonSchema(EntityDescriptorRepresentation)

        def jsonSchemaOutputFile = new File('src/test/resources/entity-descriptor-json-schema.json')
        jsonSchemaOutputFile.delete()
        jsonSchemaOutputFile.withWriter('UTF-8') {
            it.write(jsonSchema.toString())
        }
    }*/
}