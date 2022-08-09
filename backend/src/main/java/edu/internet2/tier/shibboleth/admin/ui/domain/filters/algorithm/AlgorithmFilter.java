package edu.internet2.tier.shibboleth.admin.ui.domain.filters.algorithm;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.IFilterTarget;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.ITargetable;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
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
@Audited
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class AlgorithmFilter extends MetadataFilter implements ITargetable {
    @OneToOne(cascade = CascadeType.ALL) private AlgorithmFilterTarget algorithmFilterTarget;

    @ElementCollection
    @OrderColumn
    private List<String> algorithms;

    public AlgorithmFilter() {
        type = "Algorithm";
    }

    @Override
    public IFilterTarget getTarget() {
        return algorithmFilterTarget;
    }

    private AlgorithmFilter updateConcreteFilterTypeData(AlgorithmFilter filterToBeUpdated) {
        filterToBeUpdated.setAlgorithms(getAlgorithms());
        filterToBeUpdated.setAlgorithmFilterTarget(getAlgorithmFilterTarget());
        return filterToBeUpdated;
    }

    @Override
    public MetadataFilter updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated) {
        return updateConcreteFilterTypeData((AlgorithmFilter) filterToBeUpdated);
    }
}