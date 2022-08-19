package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySetting;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository to manage {@link ShibPropertySetting} instances.
 */
public interface ShibPropertySettingRepository extends JpaRepository<ShibPropertySetting, String> {
}