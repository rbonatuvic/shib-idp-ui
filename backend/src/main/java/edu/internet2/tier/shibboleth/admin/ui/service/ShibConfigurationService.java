package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibConfigurationProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.repository.ProjectionIdAndName;

import java.util.Collection;
import java.util.List;

public interface ShibConfigurationService {
    void addAllConfigurationProperties(Collection<ShibConfigurationProperty> newProperties);

    ShibPropertySet create(ShibPropertySet set) throws ObjectIdExistsException;

    void delete(int resourceId) throws PersistentEntityNotFound;

    List<ShibConfigurationProperty> getAllConfigurationProperties();

    List<ProjectionIdAndName> getAllPropertySets();

    List<String> getExistingPropertyNames();

    ShibPropertySet getSet(int resourceId) throws PersistentEntityNotFound;

    ShibConfigurationProperty save(ShibConfigurationProperty prop);

    ShibPropertySet update(ShibPropertySet setToUpdate) throws PersistentEntityNotFound;
}