package edu.internet2.tier.shibboleth.admin.ui.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;

import org.hibernate.envers.Audited;

import lombok.Data;

@Entity(name = "custom_entity_attribute_definition")
@Audited
@Data
public class CustomEntityAttributeDefinition {
    @Id
    @Column(nullable = false)
    String name;

    @Column(name = "help_text", nullable = true)
    String helpText;

    @Column(name = "attribute_type", nullable = false)
    CustomAttributeType attributeType;

    @Column(name = "default_value", nullable = true)
    String defaultValue;
    
    @ElementCollection
    @CollectionTable(name = "custom_entity_attr_list_items", joinColumns = @JoinColumn(name = "name"))
    @Column(name = "value", nullable = false)
    Set<String> customAttrListDefinitions = new HashSet<>();
    
    // @TODO: logic to ensure defaultValue matches an item from the list of values when SELECTION_LIST is the type ??
}

enum CustomAttributeType {
    STRING, BOOLEAN, INTEGER, LONG, DOUBLE, DURATION, SELECTION_LIST, SPRING_BEAN_ID
}
