package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.MetadataFilter;
import org.springframework.data.repository.CrudRepository;

public interface FilterRepository extends CrudRepository<MetadataFilter, Long> {
}
