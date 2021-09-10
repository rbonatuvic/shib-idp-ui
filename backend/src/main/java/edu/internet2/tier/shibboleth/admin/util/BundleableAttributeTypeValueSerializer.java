package edu.internet2.tier.shibboleth.admin.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import edu.internet2.tier.shibboleth.admin.ui.domain.BundleableAttributeType;

import java.io.IOException;

/**
 * This simplifies translation to the front end. We use the ENUM on the backend, but the <code>BundleableAttributeType</code>
 * is tagged to serialize using this helper.
 * Note: The deserialize is done naturally by setting <code>spring.jackson.mapper.accept-case-insensitive-enums=true</code> in
 * the application.properties and by the setup of the ENUM itself
 */
public class BundleableAttributeTypeValueSerializer extends StdSerializer<BundleableAttributeType> {
    public BundleableAttributeTypeValueSerializer() {
        this(null);
    }

    public BundleableAttributeTypeValueSerializer(Class<BundleableAttributeType> t) {
        super(t);
    }

    @Override
    public void serialize(BundleableAttributeType value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeString(value.label());
    }
}