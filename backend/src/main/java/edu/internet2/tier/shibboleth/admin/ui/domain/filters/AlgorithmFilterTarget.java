package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
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
    @Getter
    @Setter
    private AlgorithmFilterTargetType algorithmFilterTargetType;

    @Override
    @JsonIgnore
    public String getTargetTypeValue() {
        return algorithmFilterTargetType == null ? "NONE" : algorithmFilterTargetType.name();
    }

    public enum AlgorithmFilterTargetType {
        ENTITY, CONDITION_SCRIPT, CONDITION_REF
    }
}