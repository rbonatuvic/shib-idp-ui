package edu.internet2.tier.shibboleth.admin.ui.security.service;

import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IRolesService {

    Role createRole(Role role) throws RoleExistsConflictException;

    List<Role> findAll();

    Optional<Role> findByName(String roleNone);

    Role findByResourceId(String resourceId) throws PersistentEntityNotFound;

    Set<Role> getAndCreateAllRoles(Set<String> roles);

    void deleteDefinition(String resourceId) throws PersistentEntityNotFound, RoleDeleteException;

    Role updateRole(Role role) throws PersistentEntityNotFound;

    void save(Role newUserRole);
}