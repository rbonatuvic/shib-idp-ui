package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity(name = "attribute_bundle_definition")
@Data
public class AttributeBundle {
    @Column(nullable = false)
    @ElementCollection
    Set<BundleableAttributeType> attributes = new HashSet<>();

    @Column(name = "name", nullable = true)
    String name;

    @Id
    @Column(name = "resource_id", nullable = false)
    String resourceId = UUID.randomUUID().toString();
}