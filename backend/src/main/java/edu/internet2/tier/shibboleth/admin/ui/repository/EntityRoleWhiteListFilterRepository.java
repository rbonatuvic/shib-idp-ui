package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data CRUD repository for instances of {@link EntityRoleWhiteListFilter}s.
 */
public interface EntityRoleWhiteListFilterRepository extends CrudRepository<EntityRoleWhiteListFilter, Long> {

    EntityRoleWhiteListFilter findByName(String name);

    EntityRoleWhiteListFilter findByResourceId(String resourceId);

    boolean deleteByResourceId(String resourceId);
}
