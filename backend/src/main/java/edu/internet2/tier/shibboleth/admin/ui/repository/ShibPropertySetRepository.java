package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository to manage {@link ShibPropertySet} instances.
 */
public interface ShibPropertySetRepository extends JpaRepository<ShibPropertySet, String> {
    ShibPropertySet findByName(String name);

    ShibPropertySet findByResourceId(Integer id);

    List<ProjectionIdAndName> findAllBy();
}