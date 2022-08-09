package edu.internet2.tier.shibboleth.admin.ui.domain.filters.algorithm;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.AbstractFilterTarget;
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
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
public class AlgorithmFilterTarget extends AbstractFilterTarget {
    private AlgorithmFilterTargetType targetType;

    @Override
    public String getTargetTypeValue() {
        return targetType == null ? "NONE" : targetType.name();
    }

    public void setAlgorithmFilterTargetType(AlgorithmFilterTargetType type) {
        this.targetType = type;
    }

    public enum AlgorithmFilterTargetType {
        ENTITY, CONDITION_SCRIPT, CONDITION_REF
    }
}