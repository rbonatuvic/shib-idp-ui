package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

/**
 * Spring Data repository to manage entities of type {@link User}.
 *
 * @author Dmitriy Kopylenko
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Set<User> findByRoles_Name(String roleName);
}
