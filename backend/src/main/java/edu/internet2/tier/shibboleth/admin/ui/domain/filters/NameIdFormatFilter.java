package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;

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
public class NameIdFormatFilter extends MetadataFilter {

    public NameIdFormatFilter() {
        type = "NameIDFormat";
    }

    private Boolean removeExistingFormats;

    @ElementCollection
    @OrderColumn
    private List<String> formats;

    @OneToOne(cascade = CascadeType.ALL)
    private NameIdFormatFilterTarget nameIdFormatFilterTarget;

    private NameIdFormatFilter updateConcreteFilterTypeData(NameIdFormatFilter filterToBeUpdated) {
        filterToBeUpdated.setRemoveExistingFormats(getRemoveExistingFormats());
        filterToBeUpdated.setFormats(getFormats());
        filterToBeUpdated.setNameIdFormatFilterTarget(getNameIdFormatFilterTarget());
        return filterToBeUpdated;
    }

    @Override
    public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((NameIdFormatFilter) filterToBeUpdated);
    }
    
}
