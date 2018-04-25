package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver;
import org.springframework.data.repository.CrudRepository;

/**
 * Repository to manage {@link edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver} instances.
 */
public interface MetadataResolverRepository extends CrudRepository<MetadataResolver, Long> {
    MetadataResolver findByName(String name);
}
