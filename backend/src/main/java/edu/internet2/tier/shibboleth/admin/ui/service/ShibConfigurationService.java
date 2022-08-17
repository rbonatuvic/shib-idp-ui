package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.ShibConfigurationProperty;

import java.util.Collection;
import java.util.List;

public interface ShibConfigurationService {
    void addAll(Collection<ShibConfigurationProperty> newProperties);

    List<String> getExistingPropertyNames();
}