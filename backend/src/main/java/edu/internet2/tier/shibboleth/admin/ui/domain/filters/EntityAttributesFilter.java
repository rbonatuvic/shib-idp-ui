package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import javax.persistence.PostLoad;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeListFromAttributeReleaseList;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeListFromRelyingPartyOverridesRepresentation;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeReleaseListFromAttributeList;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getRelyingPartyOverridesRepresentationFromAttributeList;

@Entity
@EqualsAndHashCode(callSuper = true, exclude={"attributeRelease", "relyingPartyOverrides"})
@Getter
@Setter
@ToString
@Audited
public class EntityAttributesFilter extends MetadataFilter {
    private static final long serialVersionUID = 1L;

    public EntityAttributesFilter() {
        type = "EntityAttributes";
    }

    @OneToOne(cascade = CascadeType.ALL)
    private EntityAttributesFilterTarget entityAttributesFilterTarget;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    @JsonIgnore
    private List<Attribute> attributes = new ArrayList<>();

    @Transient
    private List<String> attributeRelease = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "entityAttributesFilter", orphanRemoval = true)
    private Set<CustomEntityAttributeFilterValue> customEntityAttributes = new HashSet<>();

    public void setCustomEntityAttributes (Set<CustomEntityAttributeFilterValue> newValues) {
        customEntityAttributes.clear();
        customEntityAttributes.addAll(newValues);
    }
    
    public void setAttributeRelease(List<String> attributeRelease) {
        this.attributeRelease = attributeRelease;
        this.rebuildAttributes();
    }

    @Transient
    private Map<String, Object> relyingPartyOverrides;

    public void setRelyingPartyOverrides(Map<String, Object> relyingPartyOverridesRepresentation) {
        this.relyingPartyOverrides = relyingPartyOverridesRepresentation;
        this.rebuildAttributes();
    }

    //TODO: yeah, I'm not too happy, either
    private void rebuildAttributes() {
        this.attributes.clear();
        this.attributes.addAll((List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>)getAttributeListFromAttributeReleaseList(this.attributeRelease));
        this.attributes.addAll((List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>)getAttributeListFromRelyingPartyOverridesRepresentation(this.relyingPartyOverrides));
    }

    @PostLoad
    public void intoTransientRepresentation() {
        //For some update operations, list of attributes could contain null values. Filter them out
        this.attributes.removeIf(Objects::isNull);
        this.attributeRelease = getAttributeReleaseListFromAttributeList(this.attributes);
        this.relyingPartyOverrides = getRelyingPartyOverridesRepresentationFromAttributeList(this.attributes);
    }

    private EntityAttributesFilter updateConcreteFilterTypeData(EntityAttributesFilter filterToBeUpdated) {
        filterToBeUpdated.setEntityAttributesFilterTarget(getEntityAttributesFilterTarget());
        filterToBeUpdated.setRelyingPartyOverrides(getRelyingPartyOverrides());
        filterToBeUpdated.setAttributeRelease(getAttributeRelease());
        filterToBeUpdated.setCustomEntityAttributes(customEntityAttributes);
        return filterToBeUpdated;
    }

    @Override
    public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((EntityAttributesFilter) filterToBeUpdated);
    }
}
