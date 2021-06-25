package edu.internet2.tier.shibboleth.admin.ui.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.CustomEntityAttributeFilterValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;

public interface CustomEntityAttributeFilterValueRepository extends JpaRepository<CustomEntityAttributeFilterValue, Long> {
    // Not entirely sure this is needed for the core, but it did make validation/unit testing a whole lot easier
    CustomEntityAttributeFilterValue findByEntityAttributesFilterAndCustomEntityAttributeDefinition(EntityAttributesFilter eaf , CustomEntityAttributeDefinition cead);
    
    List<CustomEntityAttributeFilterValue> findAllByCustomEntityAttributeDefinition(CustomEntityAttributeDefinition definition);
}
