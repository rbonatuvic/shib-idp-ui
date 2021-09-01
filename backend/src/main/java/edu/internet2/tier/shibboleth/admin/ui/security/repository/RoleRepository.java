package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data repository to manage entities of type {@link Role}.
 *
 * @author Dmitriy Kopylenko
 */
public interface RoleRepository extends JpaRepository<Role, Long> {

    void deleteByResourceId(String resourceId);

    Optional<Role> findByName(final String name);

    Optional<Role> findByResourceId(String resourceId);
}
