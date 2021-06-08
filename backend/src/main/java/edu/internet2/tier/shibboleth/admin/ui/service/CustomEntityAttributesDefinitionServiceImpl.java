package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.CustomEntityAttributeFilterValue;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeFilterValueRepository;

@Service
@Primary
public class CustomEntityAttributesDefinitionServiceImpl implements CustomEntityAttributesDefinitionService {
    @Autowired
    CustomEntityAttributeFilterValueRepository customEntityAttributeFilterValueRepository;
    
    @Autowired
    EntityManager entityManager;
    
    private List<ICustomEntityAttributesDefinitionListener> listeners = new ArrayList<>();

    @Autowired
    private CustomEntityAttributeDefinitionRepository repository;
    
    @Override
    public void addCustomEntityAttributesDefinitionListener(ICustomEntityAttributesDefinitionListener listener) {
        listeners.add(listener);        
    }
    
    @Override
    @Transactional
    public CustomEntityAttributeDefinition createOrUpdateDefinition(CustomEntityAttributeDefinition definition) {
        CustomEntityAttributeDefinition result = repository.save(definition);
        notifyListeners();
        return result;
    }

    @Override
    @Transactional
    public void deleteDefinition(CustomEntityAttributeDefinition definition) {
        // must remove any CustomEntityAttributeFilterValues first to avoid integrity constraint issues
        List<CustomEntityAttributeFilterValue> customEntityValues = customEntityAttributeFilterValueRepository.findAllByCustomEntityAttributeDefinition(definition);
        customEntityValues.forEach(value ->  {
            value.getEntityAttributesFilter().getCustomEntityAttributes().remove(value);
            entityManager.remove(value);
            customEntityAttributeFilterValueRepository.delete(value);
        });
        CustomEntityAttributeDefinition entityToRemove = repository.findByName(definition.getName());
        repository.delete(entityToRemove);
        notifyListeners();
    }

    @Override
    public CustomEntityAttributeDefinition find(String name) {
        return repository.findByName(name);
    }

    @Override
    public List<CustomEntityAttributeDefinition> getAllDefinitions() {
        return repository.findAll();
    }

    private void notifyListeners() {
        listeners.forEach(l -> l.customEntityAttributesDefinitionChangeOccurred());
    }
}
