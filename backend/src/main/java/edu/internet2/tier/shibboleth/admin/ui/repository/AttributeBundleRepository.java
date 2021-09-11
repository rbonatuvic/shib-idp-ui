package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository to manage {@link edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle} instances.
 */
public interface AttributeBundleRepository extends JpaRepository<AttributeBundle, String> {
    List<AttributeBundle> findAll();

    Optional<AttributeBundle> findByResourceId(String resourceId);

    AttributeBundle save(AttributeBundle target);
}