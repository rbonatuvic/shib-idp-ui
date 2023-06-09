package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import org.springframework.data.repository.CrudRepository;

public interface FilterRepository extends CrudRepository<MetadataFilter, Long> {
    MetadataFilter findByResourceId(String resourceId);
}
