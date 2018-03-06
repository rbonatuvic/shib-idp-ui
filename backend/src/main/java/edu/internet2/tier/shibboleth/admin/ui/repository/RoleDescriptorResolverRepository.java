package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.RoleDescriptorResolver;
import org.springframework.data.repository.CrudRepository;


/**
 * Repository to manage {@link RoleDescriptorResolver} instances.
 */
public interface RoleDescriptorResolverRepository extends CrudRepository<RoleDescriptorResolver, Long> {

}
