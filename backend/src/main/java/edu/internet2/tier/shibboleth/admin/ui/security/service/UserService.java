package edu.internet2.tier.shibboleth.admin.ui.security.service;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class UserService {

    private RoleRepository roleRepository;
    private UserRepository userRepository;

    public UserService(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    /**
     * Given a user with a defined User.role, update the User.roles collection with that role.
     *
     * This currently exists because users should only ever have one role in the system at this time. However, user
     * roles are persisted as a set of roles (for future-proofing). Once we start allowing a user to have multiple roles,
     * this method and User.role can go away.
     * @param user
     */
    public void updateUserRole(User user) {
        if (StringUtils.isNotBlank(user.getRole())) {
            Optional<Role> userRole = roleRepository.findByName(user.getRole());
            if (userRole.isPresent()) {
                Set<Role> userRoles = new HashSet<>();
                userRoles.add(userRole.get());
                user.setRoles(userRoles);
            } else {
                throw new RuntimeException(String.format("User with username [%s] is defined with role [%s] which does not exist in the system!", user.getUsername(), user.getRole()));
            }
        } else {
            throw new RuntimeException(String.format("User with username [%s] has no role defined and therefor cannot be updated!", user.getUsername()));
        }
    }

    public User getCurrentUser() {
        User user = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            String principal = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (StringUtils.isNotBlank(principal)) {
                Optional<User> persistedUser = userRepository.findByUsername(principal);
                if (persistedUser.isPresent()) {
                    user = persistedUser.get();
                }
            }
        }
        return user;
    }
}
