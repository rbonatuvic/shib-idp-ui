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
public class CustomEntityAttributeDefinition implements IRelyingPartyOverrideProperty {
    @Id
    @Column(nullable = false)
    String name;
    
    @Column(name = "attribute_friendly_name", nullable = true)
    String attributeFriendlyName;

    @Column(name = "attribute_name", nullable = true)
    String attributeName;

    @Column(name = "attribute_type", nullable = false)
    CustomAttributeType attributeType;

    @ElementCollection
    @CollectionTable(name = "custom_entity_attr_list_items", joinColumns = @JoinColumn(name = "name"))
    @Column(name = "value", nullable = false)
    Set<String> customAttrListDefinitions = new HashSet<>();
    
    @Column(name = "default_value", nullable = true)
    String defaultValue;

    @Column(name = "display_name", nullable = true)
    String displayName;
    
    @Column(name = "display_type", nullable = true)
    String displayType;

    @Column(name = "help_text", nullable = true)
    String helpText;

    @Column(name = "invert", nullable = true)
    String invert;
    
    @Override
    public Set<String> getDefaultValues() {
        return customAttrListDefinitions;
    }

    @Override
    public String getPersistType() {
        return attributeType.toString();
    }

    @Override
    public String getPersistValue() {
        // Definitions don't have a persist value, here to comply with the interface only
        return null;
    }

    @Override
    public void setDefaultValues(Set<String> defaultValues) {
        // This is here to comply with the interface only and should not be used to change the set of values in this implementation
    }

    @Override
    public void setPersistType(String persistType) {
        // WHAT TO DO? This is "attributeType", but need to match up to AttributeTypes in ModelRepresentationConversions??
    }

    @Override
    public void setPersistValue(String persistValue) {
        // Definitions don't have a persist value, here to comply with the interface only        
    }
    
}
