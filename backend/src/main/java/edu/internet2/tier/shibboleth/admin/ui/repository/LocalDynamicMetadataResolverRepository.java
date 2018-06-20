package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data CRUD repository for instances of {@link LocalDynamicMetadataResolver}s.
 */
public interface LocalDynamicMetadataResolverRepository extends CrudRepository<LocalDynamicMetadataResolver, Long> {

    LocalDynamicMetadataResolver findByName(String name);

    boolean deleteByResourceId(String resourceId);

    LocalDynamicMetadataResolver findByResourceId(String resourceId);
}
