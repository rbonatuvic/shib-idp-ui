package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data repository to manage entities of type {@link User}.
 *
 * @author Dmitriy Kopylenko
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
