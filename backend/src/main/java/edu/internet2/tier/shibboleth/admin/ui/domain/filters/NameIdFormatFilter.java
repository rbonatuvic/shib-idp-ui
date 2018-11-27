package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
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
    private List<FormatAndTarget> formats;

    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @EqualsAndHashCode
    public static class FormatAndTarget {
        private String format;
        private String value;
        private Type type;

        public enum Type {
            ENTITY, CONDITION_REF, CONDITION_SCRIPT
        }
    }
}
