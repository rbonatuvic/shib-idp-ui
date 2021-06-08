package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.CustomEntityAttributeFilterValue;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeFilterValueRepository;

@Service
@Primary
public class CustomEntityAttributesDefinitionServiceImpl implements CustomEntityAttributesDefinitionService {
    @Autowired
    private CustomEntityAttributeDefinitionRepository repository;
    
    @Autowired
    CustomEntityAttributeFilterValueRepository customEntityAttributeFilterValueRepository;
    
    @Autowired
    EntityManager entityManager;

    @Override
    public CustomEntityAttributeDefinition createOrUpdateDefinition(CustomEntityAttributeDefinition definition) {
        return repository.save(definition);
    }
    
    @Override
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
    }

    @Override
    public CustomEntityAttributeDefinition find(String name) {
        return repository.findByName(name);
    }

    @Override
    public List<CustomEntityAttributeDefinition> getAllDefinitions() {
        return repository.findAll();
    }

}
