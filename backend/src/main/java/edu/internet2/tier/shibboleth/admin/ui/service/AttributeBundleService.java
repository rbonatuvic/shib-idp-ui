package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.repository.AttributeBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttributeBundleService {
    @Autowired
    AttributeBundleRepository attributeBundleRepository;

    public AttributeBundle create(AttributeBundle bundle) throws ObjectIdExistsException {
        if (attributeBundleRepository.findByResourceId(bundle.getResourceId()).isPresent()) {
            throw new ObjectIdExistsException(bundle.getResourceId());
        }
        return attributeBundleRepository.save(bundle);
    }

    public List<AttributeBundle> findAll() {
        return attributeBundleRepository.findAll();
    }

    public void deleteDefinition(String resourceId) throws EntityNotFoundException {
        if (attributeBundleRepository.findByResourceId(resourceId).isEmpty()) {
            throw new EntityNotFoundException(String.format("Unable to find attribute bundle with resource id: [%s] for deletion", resourceId));
        }
        attributeBundleRepository.deleteById(resourceId);
    }
}