package edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class ShibPropertySettingJacksonSerializer extends StdSerializer<ShibPropertySetting> {
    public ShibPropertySettingJacksonSerializer() {
        this(null);
    }

    public ShibPropertySettingJacksonSerializer(Class<ShibPropertySetting> t) {
        super(t);
    }

    @Override
    public void serialize(ShibPropertySetting sps, JsonGenerator generator, SerializerProvider provider) throws IOException {
        generator.writeStartObject();
        generator.writeNumberField("resourceId", sps.getResourceId());
        generator.writeStringField("configFile", sps.getConfigFile());
        generator.writeStringField("propertyName", sps.getPropertyName());
        if (sps.getCategory() != null) {
            generator.writeStringField("category", sps.getCategory());
        }
        generator.writeStringField("displayType", sps.getDisplayType());

        switch (sps.getDisplayType()) {
        case "boolean":
            generator.writeBooleanField("propertyValue", Boolean.valueOf(sps.getPropertyValue()));
            break;
        case "number":
            try {
                generator.writeNumberField("propertyValue", Long.parseLong(sps.getPropertyValue()));
            } catch (NumberFormatException notANumber) {
                generator.writeStringField("propertyValue", sps.getPropertyValue());
            }
            break;
        default:
            generator.writeStringField("propertyValue", sps.getPropertyValue());
        }

        generator.writeEndObject();
    }

}