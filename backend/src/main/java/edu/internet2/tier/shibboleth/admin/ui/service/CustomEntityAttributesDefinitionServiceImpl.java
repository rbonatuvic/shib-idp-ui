package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.CustomEntityAttributeFilterValue;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeFilterValueRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.events.CustomEntityAttributeDefinitionChangeEvent;

@Service
public class CustomEntityAttributesDefinitionServiceImpl implements CustomEntityAttributesDefinitionService {    
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;
    
    @Autowired
    CustomEntityAttributeFilterValueRepository customEntityAttributeFilterValueRepository;
    
    @Autowired
    EntityManager entityManager;
    
    @Autowired
    private CustomEntityAttributeDefinitionRepository repository;
       
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
        applicationEventPublisher.publishEvent(new CustomEntityAttributeDefinitionChangeEvent(this));
    }
}
