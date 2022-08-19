package edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties;

import edu.internet2.tier.shibboleth.admin.util.EmptyStringToNullConverter;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "shib_property_set")
@Audited
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class ShibPropertySet {
    @Id
    @GeneratedValue
    private int resourceId;

    @Column(unique = true, nullable = false)
    @Convert(converter = EmptyStringToNullConverter.class)
    private String name;

    @OneToMany
    private List<ShibPropertySetting> properties = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (o instanceof ShibPropertySet) {
            ShibPropertySet that = (ShibPropertySet) o;
            boolean result = this.name.equals(that.name) && this.resourceId == that.resourceId && this.properties.size() == that.properties.size();
            if (result == true) {
                for (ShibPropertySetting thisSetting : this.properties) {
                    if ( !that.properties.contains(thisSetting) ) {
                        return false;
                    }
                }
            }
            return result;
        }
        return false;
    }
}