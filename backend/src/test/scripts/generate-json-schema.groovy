import com.fasterxml.jackson.databind.ObjectMapper
import com.kjetland.jackson.jsonSchema.JsonSchemaGenerator
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityIdsSearchResultRepresentation

import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT

TARGET_DIRECTORY = "../resources"

def generateSchemaFor(Class clazz, String outputFileName) {
    def om = new ObjectMapper().with { it.enable(INDENT_OUTPUT); it }
    def schemaGenerator = new JsonSchemaGenerator(om)
    def jsonSchema = schemaGenerator.generateJsonSchema(clazz)

    def jsonSchemaOutputFile = new File("$TARGET_DIRECTORY/$outputFileName")
    jsonSchemaOutputFile.delete()
    jsonSchemaOutputFile.withWriter('UTF-8') {
        it.write(jsonSchema.toString())
    }
}

generateSchemaFor(EntityIdsSearchResultRepresentation, "entity-ids-search-json-schema.json")