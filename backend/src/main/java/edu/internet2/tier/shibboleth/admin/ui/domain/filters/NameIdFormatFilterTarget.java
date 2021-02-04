package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@ToString
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
public class NameIdFormatFilterTarget extends AbstractAuditable {

    public enum NameIdFormatFilterTargetType {
        ENTITY, CONDITION_SCRIPT, REGEX
    }

    private NameIdFormatFilterTargetType nameIdFormatFilterTargetType;

    public NameIdFormatFilterTargetType getNameIdFormatFilterTargetType() {
        return nameIdFormatFilterTargetType;
    }

    public void setNameIdFormatFilterTargetType(NameIdFormatFilterTargetType nameIdFormatFilterTargetType) {
        this.nameIdFormatFilterTargetType = nameIdFormatFilterTargetType;
    }

    @ElementCollection
    @OrderColumn
    private List<String> value;

    public List<String> getValue() {
        return value;
    }

    public void setSingleValue(String value) {
        List<String> values = new ArrayList<>();
        values.add(value);
        this.value = values;
    }

    public void setValue(List<String> value) {
        this.value = value;
    }


}
