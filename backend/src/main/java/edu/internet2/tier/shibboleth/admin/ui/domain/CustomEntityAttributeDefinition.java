package edu.internet2.tier.shibboleth.admin.ui.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Transient;

import liquibase.pro.packaged.O;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.envers.Audited;

import lombok.Data;

@Entity(name = "custom_entity_attribute_definition")
@Audited
@Data
public class CustomEntityAttributeDefinition implements IRelyingPartyOverrideProperty {
    @Column(name = "attribute_friendly_name", nullable = true)
    String attributeFriendlyName;
    
    @Column(name = "attribute_name", nullable = true)
    String attributeName;

    @Column(name = "attribute_type", nullable = false)
    CustomAttributeType attributeType;

    @ElementCollection
    @CollectionTable(name = "custom_entity_attr_list_items", joinColumns = @JoinColumn(name = "name"))
    @Fetch(FetchMode.JOIN)
    @Column(name = "item_value", nullable = false)
    Set<String> customAttrListDefinitions = new HashSet<>();

    @Column(name = "default_value", nullable = true)
    String defaultValue;
    
    @Column(name = "display_name", nullable = true)
    String displayName;

    @Transient
    Set<String> examples;
    
    @Column(name = "help_text", nullable = true)
    String helpText;
    
    @Column(name = "invert", nullable = true)
    String invert;

    @Column(nullable = false)
    String name;
    
    @Column(name = "persist_type", nullable = true)
    String persistType;
    
    @Column(name = "persist_value", nullable = true)
    String persistValue;

    @Id
    @Column(name = "resource_id", nullable = false)
    String resourceId = UUID.randomUUID().toString();

    String protocol = "saml";

    @Override
    public Set<String> getDefaultValues() {
        return customAttrListDefinitions;
    }
   
    @Override
    public String getDisplayType() {
        return attributeType.name().toLowerCase();
    }
    
    @Override
    public Boolean getFromConfigFile() {
        return Boolean.FALSE;
    }
    
    public String getTypeForUI() {
        switch (attributeType) {
        case BOOLEAN:
        case INTEGER:
            return getDisplayType();
        case SELECTION_LIST:
            return "list";
        default: // DOUBLE, DURATION, LONG, SPRING_BEAN_ID, STRING
            return "string";            
        }
    }

    @Override
    public String getProtocol() {
        return protocol == null ? "saml, oidc" : protocol;
    }

    @Override
    public void setDefaultValues(Set<String> defaultValues) {
        // This is here to comply with the interface only and should not be used to change the set of values in this implementation
    }

    @Override
    public void setDisplayType(String displayType) {
        // This is here to comply with the interface only and should not be used to change the value in this implementation 
    }
    
    /**
     * Ensure there are no whitespace characters in the name
     */
    @Override
    public void setName(String name) {
        this.name = name.replaceAll("\\s","");
    }
    
    public void updateExamplesList() {
        examples = customAttrListDefinitions;
    }
}