package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;

public interface IRolesService {

    Role createRole(Role role) throws RoleExistsConflictException;

    Role updateRole(Role role) throws EntityNotFoundException;

    List<Role> findAll();

    Role findByResourceId(String resourceId) throws EntityNotFoundException;

    void deleteDefinition(String resourceId) throws EntityNotFoundException, RoleDeleteException;

}
