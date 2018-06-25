package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation;
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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Transient;
import java.util.ArrayList;

import java.util.List;

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

    @Transient
    private RelyingPartyOverridesRepresentation relyingPartyOverrides;

    @PostLoad
    public void intoTransientRepresentation() {
        this.attributeRelease = getAttributeReleaseListFromAttributeList(this.attributes);
        this.relyingPartyOverrides = getRelyingPartyOverridesRepresentationFromAttributeList(attributes);
        updateVersion();
    }

    @PrePersist
    @PreUpdate
    public void fromTransientRepresentation() {
        List<org.opensaml.saml.saml2.core.Attribute> attributeList = new ArrayList<>();
        attributeList.addAll(getAttributeListFromAttributeReleaseList(this.attributeRelease));
        attributeList.addAll(getAttributeListFromRelyingPartyOverridesRepresentation(this.relyingPartyOverrides));

        if(!attributeList.isEmpty()) {
            this.attributes = (List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) attributeList;
        }
    }
}
