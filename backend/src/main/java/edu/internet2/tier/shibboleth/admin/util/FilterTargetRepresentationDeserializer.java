package edu.internet2.tier.shibboleth.admin.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterTargetRepresentation;
import jdk.nashorn.internal.runtime.regexp.joni.ast.StringNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class FilterTargetRepresentationDeserializer extends StdDeserializer<FilterTargetRepresentation> {

    public FilterTargetRepresentationDeserializer() {
        this(null);
    }

    public FilterTargetRepresentationDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public FilterTargetRepresentation deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
        FilterTargetRepresentation representation = new FilterTargetRepresentation();

        JsonNode jsonNode = jsonParser.getCodec().readTree(jsonParser);
        String type = jsonNode.get("type").textValue();
        List<String> values = new ArrayList<>();
        for (JsonNode valuesNode : jsonNode.get("value")) {
            values.add(valuesNode.textValue());
        }

        representation.setType(type);
        representation.setValue(values);

        return representation;
    }
}
