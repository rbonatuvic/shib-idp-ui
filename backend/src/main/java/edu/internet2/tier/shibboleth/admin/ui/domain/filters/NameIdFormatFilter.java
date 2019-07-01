package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import java.util.List;

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

    private Boolean removeExistingFormats = false;

    @ElementCollection
    @OrderColumn
    private List<String> formats;

    @OneToOne(cascade = CascadeType.ALL)
    private NameIdFormatFilterTarget nameIdFormatFilterTarget;

}
