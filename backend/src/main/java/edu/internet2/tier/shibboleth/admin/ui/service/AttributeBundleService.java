package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle;
import edu.internet2.tier.shibboleth.admin.ui.repository.AttributeBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttributeBundleService {
    @Autowired
    AttributeBundleRepository attributeBundleRepository;

    public List<AttributeBundle> findAll() {
        return attributeBundleRepository.findAll();
    }
}