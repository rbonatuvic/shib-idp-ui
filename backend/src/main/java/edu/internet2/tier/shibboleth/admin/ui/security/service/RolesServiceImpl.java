package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;

@Service
public class RolesServiceImpl implements IRolesService {
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public Role createRole(Role role) throws RoleExistsConflictException {
        Optional<Role> found = roleRepository.findByName(role.getName());
        // If already defined, we don't want to create a new one, nor do we want this call update the definition
        if (found.isPresent()) {
            throw new RoleExistsConflictException(
                            String.format("Call update (PUT) to modify the role with name: [%s]", role.getName()));
        }
        return roleRepository.save(role);
    }

    @Override
    public void deleteDefinition(String resourceId) throws EntityNotFoundException, RoleDeleteException {
        Optional<Role> found = roleRepository.findByResourceId(resourceId);
        if (found.isPresent() && !found.get().getUsers().isEmpty()) {
            throw new RoleDeleteException(String.format("Unable to delete role with resource id: [%s] - remove role from all users first", resourceId));
        }
        roleRepository.deleteByResourceId(resourceId);        
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role findByResourceId(String resourceId) throws EntityNotFoundException {
        Optional<Role> found = roleRepository.findByResourceId(resourceId);
        if (found.isEmpty()) {
            throw new EntityNotFoundException(String.format("Unable to find role with resource id: [%s]", resourceId));
        }
        return found.get();
    }

    @Override
    public Role updateRole(Role role) throws EntityNotFoundException {
        Optional<Role> found = roleRepository.findByName(role.getName());
        if (found.isEmpty()) {
            throw new EntityNotFoundException(String.format("Unable to find role with name: [%s]", role.getName()));
        }
        return roleRepository.save(role);
    }
}
