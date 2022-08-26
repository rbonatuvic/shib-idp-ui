package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@ToString
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
@JsonIgnoreProperties({ "handler", "hibernateLazyInitializer" })
public class NameIdFormatFilterTarget extends AbstractFilterTarget {

    private NameIdFormatFilterTargetType nameIdFormatFilterTargetType;

    public NameIdFormatFilterTargetType getNameIdFormatFilterTargetType() {
        return nameIdFormatFilterTargetType;
    }

    @Override
    @JsonIgnore
    public String getTargetTypeValue() {
        return nameIdFormatFilterTargetType.name();
    }

    public void setNameIdFormatFilterTargetType(NameIdFormatFilterTargetType nameIdFormatFilterTargetType) {
        this.nameIdFormatFilterTargetType = nameIdFormatFilterTargetType;
    }

    public enum NameIdFormatFilterTargetType {
        ENTITY, CONDITION_SCRIPT, REGEX
    }
}