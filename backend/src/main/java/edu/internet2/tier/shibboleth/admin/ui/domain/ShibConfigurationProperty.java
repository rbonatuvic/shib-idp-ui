package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
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
    String defaultValue;

    @Column(name = "description")
    String description;

    @Column(name = "idp_version", nullable = false)
    String idpVersion;

    @Column(name = "module")
    String module;

    @Column(name = "module_version")
    String moduleVersion;

    @Column(name = "note")
    String note;

    @Column(name = "property_name", nullable = false)
    String propertyName;

    @Column(name = "property_type", nullable = false)
    PropertyType propertyType;

    @Column(name = "property_value")
    String propertyValue;

    @Column(name = "selection_items")
    String selectionItems;

    public void setPropertyType(String val) {
        this.propertyType = PropertyType.valueOf(val);
    }

}

enum PropertyType {
    BOOLEAN, DURATION, INTEGER, SELECTION_LIST, SPRING_BEAN_ID, STRING
}