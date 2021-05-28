package edu.internet2.tier.shibboleth.admin.ui.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.CustomEntityAttributeFilterValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;

// Not entirely sure this is needed for the core, but it did make validation/unit testing a whole lot easier
public interface CustomEntityAttributeFilterValueRepository extends JpaRepository<CustomEntityAttributeFilterValue, Long> {
    CustomEntityAttributeFilterValue findByEntityAttributesFilterAndCustomEntityAttributeDefinition(EntityAttributesFilter eaf , CustomEntityAttributeDefinition cead);
}
