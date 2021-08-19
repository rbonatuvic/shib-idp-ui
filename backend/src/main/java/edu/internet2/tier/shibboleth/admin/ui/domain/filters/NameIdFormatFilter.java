package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
public class NameIdFormatFilter extends MetadataFilter implements ITargetable {

    public NameIdFormatFilter() {
        type = "NameIDFormat";
    }

    private Boolean removeExistingFormats;

    @ElementCollection
    @OrderColumn
    private List<String> formats;

    @OneToOne(cascade = CascadeType.ALL)
    private NameIdFormatFilterTarget nameIdFormatFilterTarget;

    @Override
    @JsonIgnore
    public IFilterTarget getTarget() {
        return nameIdFormatFilterTarget;
    }

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