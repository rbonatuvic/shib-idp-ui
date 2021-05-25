package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository;

@Service
public class CustomEntityAttributesDefinitionServiceImpl implements CustomEntityAttributesDefinitionService {
    @Autowired
    private CustomEntityAttributeDefinitionRepository repository;

    @Override
    public CustomEntityAttributeDefinition createOrUpdateDefinition(CustomEntityAttributeDefinition definition) {
        return repository.save(definition);
    }
    
    @Override
    public void deleteDefinition(CustomEntityAttributeDefinition definition) {
        repository.delete(definition);
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
