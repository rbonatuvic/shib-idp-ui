package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminRole;

import java.util.Optional;

/**
 * Spring Data repository to manage entities of type {@link AdminRole}.
 *
 * @author Dmitriy Kopylenko
 */
public interface AdminRoleRepository {

    Optional<AdminRole> findByName(final String name);
}
