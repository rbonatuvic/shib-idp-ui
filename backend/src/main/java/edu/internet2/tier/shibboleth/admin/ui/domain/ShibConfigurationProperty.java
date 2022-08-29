package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.util.EmptyStringToNullConverter;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.UUID;

@Entity(name = "shib_configuration_prop")
@Audited
@Data
public class ShibConfigurationProperty {
    @Id
    @Column(name = "resource_id", nullable = false)
    String resourceId = UUID.randomUUID().toString();

    @Column(name = "category", nullable = false)
    String category;

    @Column(name = "config_file", nullable = false)
    String configFile;

    @Column(name = "default_value")
    @Convert(converter = EmptyStringToNullConverter.class)
    String defaultValue;

    @Column(name = "description")
    @Convert(converter = EmptyStringToNullConverter.class)
    String description;

    @Column(name = "idp_version", nullable = false)
    String idpVersion;

    @Column(name = "module")
    @Convert(converter = EmptyStringToNullConverter.class)
    String module;

    @Column(name = "module_version")
    @Convert(converter = EmptyStringToNullConverter.class)
    String moduleVersion;

    @Column(name = "note")
    @Convert(converter = EmptyStringToNullConverter.class)
    String note;

    @Column(name = "property_name", nullable = false)
    String propertyName;

    @Column(name = "property_type", nullable = false)
    @JsonIgnore // display type is sent to the ui instead
    PropertyType propertyType;

    @Column(name = "selection_items")
    @Convert(converter = EmptyStringToNullConverter.class)
    String selectionItems;

    public String getDisplayType() {
        switch (propertyType) {
        case BOOLEAN:
            return propertyType.name().toLowerCase();
        case INTEGER:
            return "number";
        case SELECTION_LIST:
            return "list";
        default: // DURATION, SPRING_BEAN_ID, STRING
            return "string";
        }
    }

    public void setPropertyType(String val) {
        this.propertyType = PropertyType.valueOf(val);
    }

}

enum PropertyType {
    BOOLEAN, DURATION, INTEGER, SELECTION_LIST, SPRING_BEAN_ID, STRING
}