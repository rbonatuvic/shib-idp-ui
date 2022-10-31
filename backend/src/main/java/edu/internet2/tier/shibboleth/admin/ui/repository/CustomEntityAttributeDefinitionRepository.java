package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository to manage {@link CustomEntityAttributeDefinition} instances.
 */
public interface CustomEntityAttributeDefinitionRepository extends JpaRepository<CustomEntityAttributeDefinition, String> {
   
    List<CustomEntityAttributeDefinition> findAll();
    
    CustomEntityAttributeDefinition findByName(String name);
    
    CustomEntityAttributeDefinition findByResourceId(String resourceId);
    
    @SuppressWarnings("unchecked")
    CustomEntityAttributeDefinition save(CustomEntityAttributeDefinition attribute);
}