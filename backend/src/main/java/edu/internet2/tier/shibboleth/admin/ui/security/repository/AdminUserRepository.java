package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data repository to manage entities of type {@link AdminUser}.
 *
 * @author Dmitriy Kopylenko
 */
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    AdminUser findByUsername(String username);
}
