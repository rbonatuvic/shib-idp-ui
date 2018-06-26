package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.SignatureValidationFilter;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data CRUD repository for instances of {@link SignatureValidationFilter}s.
 */
public interface SignatureValidationFilterRepository extends CrudRepository<SignatureValidationFilter, Long> {

    SignatureValidationFilter findByName(String name);

    SignatureValidationFilter findByResourceId(String resourceId);

    boolean deleteByResourceId(String resourceId);
}
