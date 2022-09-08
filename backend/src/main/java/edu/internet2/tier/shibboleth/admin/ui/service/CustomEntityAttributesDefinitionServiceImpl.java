package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.events.CustomEntityAttributeDefinitionChangeEvent;

@Service
public class CustomEntityAttributesDefinitionServiceImpl implements CustomEntityAttributesDefinitionService {    
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

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
        CustomEntityAttributeDefinition entityToRemove = repository.findByResourceId(definition.getResourceId());
        repository.delete(entityToRemove);
        notifyListeners();
    }

    @Override
    public CustomEntityAttributeDefinition find(String resourceId) {
        return repository.findByResourceId(resourceId);
    }

    @Override
    public List<CustomEntityAttributeDefinition> getAllDefinitions() {
        return repository.findAll();
    }

    private void notifyListeners() {
        applicationEventPublisher.publishEvent(new CustomEntityAttributeDefinitionChangeEvent(this));
    }
}