package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.MappedSuperclass;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@MappedSuperclass
@EqualsAndHashCode(callSuper = true)
public abstract class AbstractFilterTarget extends AbstractAuditable implements IFilterTarget {
    @ElementCollection(fetch = FetchType.EAGER)
    @OrderColumn
    @Column(length = 760, name="target_value")
    protected List<String> value;

    @Override
    public List<String> getValue() {
        return value == null ? new ArrayList<>() : value;
    }

    @Override
    public void setSingleValue(String value) {
        List<String> values = new ArrayList<>();
        values.add(value);
        this.value = values;
    }

    @Override
    public void setValue(List<String> value) {
        this.value = value;
    }

}