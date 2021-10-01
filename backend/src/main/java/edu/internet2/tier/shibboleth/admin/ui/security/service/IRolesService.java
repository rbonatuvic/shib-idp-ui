package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;

public interface IRolesService {

    Role createRole(Role role) throws RoleExistsConflictException;

    List<Role> findAll();

    Optional<Role> findByName(String roleNone);

    Role findByResourceId(String resourceId) throws EntityNotFoundException;

    Set<Role> getAndCreateAllRoles(Set<String> roles);

    void deleteDefinition(String resourceId) throws EntityNotFoundException, RoleDeleteException;

    Role updateRole(Role role) throws EntityNotFoundException;

    void save(Role newUserRole);
}