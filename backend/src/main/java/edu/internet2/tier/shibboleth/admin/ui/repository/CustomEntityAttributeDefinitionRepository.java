package edu.internet2.tier.shibboleth.admin.ui.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;

/**
 * Repository to manage {@link CustomEntityAttributeDefinition} instances.
 */
public interface CustomEntityAttributeDefinitionRepository extends JpaRepository<CustomEntityAttributeDefinition, String> {
   
    List<CustomEntityAttributeDefinition> findAll();
    
    CustomEntityAttributeDefinition findByName(String name);
    
    @SuppressWarnings("unchecked")
    CustomEntityAttributeDefinition save(CustomEntityAttributeDefinition attribute);
}
