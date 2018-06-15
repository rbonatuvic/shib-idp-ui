package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import org.springframework.data.repository.CrudRepository;

/**
 * Repository to manage {@link MetadataResolver} instances.
 */
public interface MetadataResolverRepository extends CrudRepository<MetadataResolver, Long> {

    MetadataResolver findByName(String name);

    MetadataResolver findByResourceId(String resourceId);
}
