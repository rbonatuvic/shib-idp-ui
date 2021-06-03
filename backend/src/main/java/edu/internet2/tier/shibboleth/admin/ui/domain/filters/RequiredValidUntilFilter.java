package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import javax.persistence.Entity;

import org.hibernate.envers.Audited;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
public class RequiredValidUntilFilter extends MetadataFilter {

    public RequiredValidUntilFilter() {
        type = "RequiredValidUntil";
    }

    private String maxValidityInterval;

    public boolean xmlShouldBeGenerated() {
        return (maxValidityInterval != null) && (!maxValidityInterval.equals("PT0S"));
    }
    
    private RequiredValidUntilFilter updateConcreteFilterTypeData(RequiredValidUntilFilter filterToBeUpdated) {
        filterToBeUpdated.setMaxValidityInterval(getMaxValidityInterval());
        return filterToBeUpdated;
    }

    @Override
    public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((RequiredValidUntilFilter) filterToBeUpdated);
    }
}
