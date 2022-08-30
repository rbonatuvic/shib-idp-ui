package edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties;

import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity(name = "shib_property_setting")
@Audited
@Data
public class ShibPropertySetting {
    @Id
    @GeneratedValue
    private int resourceId;

    @Column
    private String configFile;

    @Column
    private String propertyName;

    @Column
    private String propertyValue;

    @Column
    private String category;

    @Column
    private String displayType;

}