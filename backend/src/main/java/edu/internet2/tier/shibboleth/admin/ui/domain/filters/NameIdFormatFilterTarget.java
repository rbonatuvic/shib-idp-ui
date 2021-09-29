package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@ToString
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
public class NameIdFormatFilterTarget extends AbstractAuditable implements IFilterTarget {

    private NameIdFormatFilterTargetType nameIdFormatFilterTargetType;

    @ElementCollection
    @OrderColumn
    private List<String> value;

    public NameIdFormatFilterTargetType getNameIdFormatFilterTargetType() {
        return nameIdFormatFilterTargetType;
    }

    @Override
    @JsonIgnore
    public String getTargetTypeValue() {
        return nameIdFormatFilterTargetType.name();
    }

    public List<String> getValue() {
        return value;
    }

    public void setNameIdFormatFilterTargetType(NameIdFormatFilterTargetType nameIdFormatFilterTargetType) {
        this.nameIdFormatFilterTargetType = nameIdFormatFilterTargetType;
    }

    public void setSingleValue(String value) {
        List<String> values = new ArrayList<>();
        values.add(value);
        this.value = values;
    }

    public void setValue(List<String> value) {
        this.value = value;
    }

    public enum NameIdFormatFilterTargetType {
        ENTITY, CONDITION_SCRIPT, REGEX
    }
}