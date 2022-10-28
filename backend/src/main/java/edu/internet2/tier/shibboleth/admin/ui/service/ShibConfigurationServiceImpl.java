package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibConfigurationProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet;
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySetting;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.repository.ProjectionIdAndName;
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibConfigurationRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibPropertySetRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibPropertySettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

@Service
public class ShibConfigurationServiceImpl implements ShibConfigurationService {
    @Autowired
    private ShibConfigurationRepository shibConfigurationRepository;

    @Autowired
    private ShibPropertySetRepository shibPropertySetRepository;

    @Autowired
    private ShibPropertySettingRepository shibPropertySettingRepository;

    @Override
    public void addAllConfigurationProperties(Collection<ShibConfigurationProperty> newProperties) {
        shibConfigurationRepository.saveAll(newProperties);
    }

    @Override
    public ShibPropertySet create(ShibPropertySet set) throws ObjectIdExistsException {
        try {
            getSet(set.getResourceId());
            throw new ObjectIdExistsException(Integer.toString(set.getResourceId()));
        }
        catch (PersistentEntityNotFound e) {
            // we don't want to find the object
        }
        return save(set);
    }

    @Override
    public void delete(int resourceId) throws PersistentEntityNotFound {
        ShibPropertySet set = shibPropertySetRepository.findByResourceId(resourceId);
        if (set == null) {
            throw new PersistentEntityNotFound(String.format("The property set with id [%s] was not found for update.", resourceId));
        }
        shibPropertySettingRepository.deleteAll(set.getProperties());
        shibPropertySetRepository.delete(set);
    }

    @Override
    public List<ShibConfigurationProperty> getAllConfigurationProperties() {
        return shibConfigurationRepository.findAll();
    }

    @Override
    public List<ProjectionIdAndName> getAllPropertySets() {
        return shibPropertySetRepository.findAllBy();
    }

    @Override
    public List<String> getExistingPropertyNames() {
        return shibConfigurationRepository.getPropertyNames();
    }

    @Override
    public ShibPropertySet getSet(int resourceId) throws PersistentEntityNotFound {
        ShibPropertySet result = shibPropertySetRepository.findByResourceId(resourceId);
        if (result == null) {
            throw new PersistentEntityNotFound((String.format("The property set with id [%s] was not found.", resourceId)));
        }
        return result;
    }

    @Override
    public ShibConfigurationProperty save(ShibConfigurationProperty prop) {
        return shibConfigurationRepository.save(prop);
    }

    @Override
    public ShibPropertySet update(ShibPropertySet setToUpdate) throws PersistentEntityNotFound {
        getSet(setToUpdate.getResourceId()); // check that it exists, if not it'll throw an exception
        return save(setToUpdate);
    }

    private ShibPropertySet save(ShibPropertySet incomingPropSet) {
        ShibPropertySet result = new ShibPropertySet();
        List<ShibPropertySetting> propertiesToUpdate = new ArrayList<>();

        if (incomingPropSet.getResourceId() == 0) {
            // The incoming set is new, so treat the properties as all new as well
            propertiesToUpdate.addAll(shibPropertySettingRepository.saveAll(incomingPropSet.getProperties()));
            result.setName(incomingPropSet.getName());
        } else {
            // if the prop set exists, get the existing entity and update it
            result = shibPropertySetRepository.findByResourceId(incomingPropSet.getResourceId());
            result.setName(incomingPropSet.getName());

            HashMap<String, ShibPropertySetting> existingPropMap = new HashMap<>();
            result.getProperties().forEach(prop -> existingPropMap.put(prop.getPropertyName(), prop));
            // find props that are no longer in the set and remove them
            incomingPropSet.getProperties().forEach(prop -> existingPropMap.remove(prop.getPropertyName()));
            shibPropertySettingRepository.deleteAll(existingPropMap.values());
            // reset our map of existing so we can find new entries
            existingPropMap.clear();
            result.getProperties().forEach(prop -> existingPropMap.put(prop.getPropertyName(), prop));
            incomingPropSet.getProperties().forEach(prop -> {
                if ( !existingPropMap.containsKey(prop.getPropertyName()) ) {
                    ShibPropertySetting updatedEntity = shibPropertySettingRepository.save(prop);
                    propertiesToUpdate.add(updatedEntity);
                } else {
                    // get the entity from the map, update it, save to update list
                    ShibPropertySetting updatedEntity = existingPropMap.get(prop.getPropertyName());
                    // the value is really the only thing that should change...
                    updatedEntity.setConfigFile(prop.getConfigFile());
                    updatedEntity.setPropertyValue(prop.getPropertyValue());
                    updatedEntity.setCategory(prop.getCategory());
                    updatedEntity.setDisplayType(prop.getDisplayType());
                    propertiesToUpdate.add(shibPropertySettingRepository.save(updatedEntity));
                }
            });
        }
        result.setProperties(propertiesToUpdate);
        return shibPropertySetRepository.save(result);
    }

}