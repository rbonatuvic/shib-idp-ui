package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import java.util.List;

public interface IFilterTarget {
    String getTargetTypeValue();

    List<String> getValue();

    void setSingleValue(String value);

    void setValue(List<String> value);
}