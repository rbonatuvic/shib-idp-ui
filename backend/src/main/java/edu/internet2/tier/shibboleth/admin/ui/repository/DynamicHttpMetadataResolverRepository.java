package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data CRUD repository for instances of {@link DynamicHttpMetadataResolver}s.
 *
 * @author Bill Smith (wsmith@unicon.net)
 */
public interface DynamicHttpMetadataResolverRepository extends CrudRepository<DynamicHttpMetadataResolver, Long> {

    DynamicHttpMetadataResolver findByName(String name);

    boolean deleteByResourceId(String resourceId);

    DynamicHttpMetadataResolver findByResourceId(String resourceId);
}