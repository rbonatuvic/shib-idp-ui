package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
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
