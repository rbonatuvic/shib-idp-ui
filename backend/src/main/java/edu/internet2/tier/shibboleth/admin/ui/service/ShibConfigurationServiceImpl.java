package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.ShibConfigurationProperty;
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class ShibConfigurationServiceImpl implements ShibConfigurationService {
    @Autowired
    private ShibConfigurationRepository repository;

    @Override
    public void addAll(Collection<ShibConfigurationProperty> newProperties) {
        repository.saveAll(newProperties);
    }

    @Override
    public List<String> getExistingPropertyNames() {
        return repository.getPropertyNames();
    }

    @Override
    public void save(ShibConfigurationProperty prop) {
        repository.save(prop);
    }

    @Override
    public List<ShibConfigurationProperty> getAll() {
        return repository.findAll();
    }
}