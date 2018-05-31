package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.opensaml.core.xml.XMLObject;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import javax.persistence.PostLoad;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getAttributeReleaseListFromAttributeList;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class EntityAttributesFilter extends MetadataFilter {

    @OneToOne(cascade = CascadeType.ALL)
    private EntityAttributesFilterTarget entityAttributesFilterTarget;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    @JsonIgnore
    private List<Attribute> attributes = new ArrayList<>();

    @Transient
    private List<String> attributeRelease = new ArrayList<>();

    @PostLoad
    public void intoTransientRepresentation() {
        this.attributeRelease = getAttributeReleaseListFromAttributeList(this.attributes);
    }
}
