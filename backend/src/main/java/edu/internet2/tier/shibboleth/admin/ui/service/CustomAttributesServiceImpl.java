package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomAttributeRepository;

@Service
public class CustomAttributesServiceImpl implements CustomAttributesService {
    @Autowired
    private CustomAttributeRepository repository;

    @Override
    public CustomAttributeDefinition createOrUpdateDefinition(CustomAttributeDefinition definition) {
        return repository.save(definition);
    }
    
    @Override
    public void deleteDefinition(CustomAttributeDefinition definition) {
        repository.delete(definition);
    }

    @Override
    public CustomAttributeDefinition find(String name) {
        return repository.findByName(name);
    }

    @Override
    public List<CustomAttributeDefinition> getAllDefinitions() {
        return repository.findAll();
    }

}
