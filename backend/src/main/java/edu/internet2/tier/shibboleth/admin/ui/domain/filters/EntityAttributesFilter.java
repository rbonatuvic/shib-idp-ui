package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.*;

@Entity
@EqualsAndHashCode(callSuper = true, exclude = { "attributeRelease", "relyingPartyOverrides" })
@Getter
@Setter
@ToString
@Audited
public class EntityAttributesFilter extends MetadataFilter implements ITargetable {
    private static final long serialVersionUID = 1L;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    @JsonIgnore
    private List<Attribute> attributes = new ArrayList<>();

    @Transient
    private List<String> attributeRelease = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntityAttributesFilterTarget entityAttributesFilterTarget;

    @Transient
    private Map<String, Object> relyingPartyOverrides;

    public EntityAttributesFilter() {
        type = "EntityAttributes";
    }

    @Override
    @JsonIgnore
    public IFilterTarget getTarget() {
        return entityAttributesFilterTarget;
    }

    @PostLoad
    public void intoTransientRepresentation() {
        //For some update operations, list of attributes could contain null values. Filter them out
        this.attributes.removeIf(Objects::isNull);
        this.attributeRelease = getAttributeReleaseListFromAttributeList(this.attributes);
        this.relyingPartyOverrides = getRelyingPartyOverridesRepresentationFromAttributeList(this.attributes);
    }

    //TODO: yeah, I'm not too happy, either
    private void rebuildAttributes() {
        this.attributes.clear();
        this.attributes.addAll((List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) getAttributeListFromAttributeReleaseList(this.attributeRelease));
        this.attributes.addAll((List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) getAttributeListFromRelyingPartyOverridesRepresentation(this.relyingPartyOverrides));
    }

    public void setAttributeRelease(List<String> attributeRelease) {
        this.attributeRelease = attributeRelease;
        this.rebuildAttributes();
    }

    public void setRelyingPartyOverrides(Map<String, Object> relyingPartyOverridesRepresentation) {
        this.relyingPartyOverrides = relyingPartyOverridesRepresentation;
        this.rebuildAttributes();
    }

    private EntityAttributesFilter updateConcreteFilterTypeData(EntityAttributesFilter filterToBeUpdated) {
        filterToBeUpdated.setEntityAttributesFilterTarget(getEntityAttributesFilterTarget());
        filterToBeUpdated.setRelyingPartyOverrides(getRelyingPartyOverrides());
        filterToBeUpdated.setAttributeRelease(getAttributeRelease());
        return filterToBeUpdated;
    }

    @Override public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((EntityAttributesFilter) filterToBeUpdated);
    }
}