package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibConfigurationProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repository to manage {@link ShibConfigurationProperty} instances.
 */
public interface ShibConfigurationRepository extends JpaRepository<ShibConfigurationProperty, String> {
    @Query(value = "select property_name from shib_configuration_prop", nativeQuery = true)
    List<String> getPropertyNames();
}