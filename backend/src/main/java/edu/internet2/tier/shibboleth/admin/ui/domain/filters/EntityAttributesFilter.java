package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import javax.persistence.PostLoad;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeListFromAttributeReleaseList;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeListFromRelyingPartyOverridesRepresentation;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeReleaseListFromAttributeList;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getRelyingPartyOverridesRepresentationFromAttributeList;

@Entity
@EqualsAndHashCode(callSuper = true, exclude={"attributeRelease", "relyingPartyOverrides"})
@Getter
@Setter
@ToString
public class EntityAttributesFilter extends MetadataFilter {

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
        this.attributeRelease = getAttributeReleaseListFromAttributeList(this.attributes);
        this.relyingPartyOverrides = getRelyingPartyOverridesRepresentationFromAttributeList(this.attributes);
    }
}