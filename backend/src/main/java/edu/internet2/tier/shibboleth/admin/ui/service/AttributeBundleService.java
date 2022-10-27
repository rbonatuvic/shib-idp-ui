package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.repository.AttributeBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void deleteDefinition(String resourceId) throws PersistentEntityNotFound {
        if (attributeBundleRepository.findByResourceId(resourceId).isEmpty()) {
            throw new PersistentEntityNotFound(String.format("Unable to find attribute bundle with resource id: [%s] for deletion", resourceId));
        }
        attributeBundleRepository.deleteById(resourceId);
    }

    public AttributeBundle updateBundle(AttributeBundle bundle) throws PersistentEntityNotFound {
        Optional<AttributeBundle> dbBundle = attributeBundleRepository.findByResourceId(bundle.getResourceId());
        if (dbBundle.isEmpty()) {
            throw new PersistentEntityNotFound(String.format("Unable to find attribute bundle with resource id: [%s] for update", bundle.getResourceId()));
        }
        AttributeBundle bundleToUpdate = dbBundle.get();
        bundleToUpdate.setName(bundle.getName());
        bundleToUpdate.setAttributes(bundle.getAttributes());
        return attributeBundleRepository.save(bundleToUpdate);
    }

    public AttributeBundle findByResourceId(String resourceId) throws PersistentEntityNotFound {
        Optional<AttributeBundle> result = attributeBundleRepository.findByResourceId(resourceId);
        if (result.isEmpty()) {
            throw new PersistentEntityNotFound(String.format("Unable to find attribute bundle with resource id: [%s] for deletion", resourceId));
        }
        return result.get();
    }
}