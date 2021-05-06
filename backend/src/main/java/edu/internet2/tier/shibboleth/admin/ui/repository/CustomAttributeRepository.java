package edu.internet2.tier.shibboleth.admin.ui.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomAttributeDefinition;

/**
 * Repository to manage {@link CustomAttributeDefinition} instances.
 */
public interface CustomAttributeRepository extends JpaRepository<CustomAttributeDefinition, String> {
   
    List<CustomAttributeDefinition> findAll();
    
    CustomAttributeDefinition findByName(String name);
    
    @SuppressWarnings("unchecked")
    CustomAttributeDefinition save(CustomAttributeDefinition attribute);
}
