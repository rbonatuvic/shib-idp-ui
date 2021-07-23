package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserGroupRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;

@Service
public class UserService implements InitializingBean {
    @Autowired
    private IGroupService groupService;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    UserGroupRepository userGroupRepository;
    
    @Autowired
    private UserRepository userRepository;

    public UserService() {
    }
    
    /**
     * Primarily for testing purposes so we can control the injections
     */
    public UserService(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }
    
    @Override
    @Transactional
    public void afterPropertiesSet() {
        // TODO: Ensure all the db users have a group - migration task
    }

    public boolean currentUserIsAdmin() {
        User user = getCurrentUser();
        return user != null && user.getRole().equals("ROLE_ADMIN");
    }
    
    @Transactional
    public void delete(String username) throws EntityNotFoundException {
        Optional<User> userToRemove = userRepository.findByUsername(username);
        if (userToRemove.isEmpty()) throw new EntityNotFoundException("User does not exist");
        User user = userToRemove.get();
        // remove all group references from the user
        user.getUserGroups().forEach(userGroup -> userGroupRepository.delete(userGroup));
        user.getUserGroups().clear();
        
        userRepository.delete(user);
    }
    
    public User getCurrentUser() {
        //TODO: Consider returning an Optional here
        User user = null;
        if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            String principal = SecurityContextHolder.getContext().getAuthentication().getName();
            if (StringUtils.isNotBlank(principal)) {
                Optional<User> persistedUser = userRepository.findByUsername(principal);
                if (persistedUser.isPresent()) {
                    user = persistedUser.get();
                }
            }
        }
        return user;
    }

    public UserAccess getCurrentUserAccess() {
        User user = getCurrentUser();
        if (user == null) {
            return UserAccess.NONE;    
        }
        if (user.getRole().equals("ROLE_ADMIN")) {
            return UserAccess.ADMIN;
        }
        if (user.getRole().equals("ROLE_USER")) {
            return UserAccess.GROUP;
        }
        return UserAccess.NONE;
    }
    
    public Group getCurrentUserGroup() {
        switch (getCurrentUserAccess()) {
        case ADMIN:
            return Group.ADMIN_GROUP;
        default:
            return getCurrentUser().getGroup();
        }
    }
    
    public boolean isAuthorizedFor(Group objectGroup) {        
        String objectGroupId = objectGroup == null ? Group.ADMIN_GROUP.getResourceId() : objectGroup.getResourceId();      
        return isAuthorizedFor(objectGroupId);
    }

    public boolean isAuthorizedFor(String objectGroupResourceId) {
        switch (getCurrentUserAccess()) { // no user returns NONE
        case ADMIN:
            return true;
        case GROUP:
            User currentUser = getCurrentUser();
            // Shouldn't be null, but for safety...
            String groupId = objectGroupResourceId == null ? "" : objectGroupResourceId;            
            return groupId.equals(currentUser.getGroupId());
        default:
            return false;
        }
    }
    
    /**
     * Creating users should always have a group. If the user isn't assigned to a group, create one based on their name.
     * If the user has the ADMIN role, they are always solely assigned to the admin group.
     * Finally, if the user has multiple groups, that came from an outside auth source, so we want to maintain that list
     * (note that if they have the admin role, we will override any group list with the single ADMIN GROUP)
     */
    @Transactional
    public User save(User user) {
        if (user.getUserGroups().size() < 2) {
            Group g;
            if (user.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
                g = groupService.find(Group.ADMIN_GROUP.getResourceId());
            } else if (user.getGroupId() == null) { // Find or create the "user's default" group
                g = new Group(user);
                try {
                    g = groupService.createGroup(g);
                }
                catch (GroupExistsConflictException e) {
                    g = groupService.find(user.getUsername());
                }
            } else {
                g = groupService.find(user.getGroupId());
            }
            user.updateUserGroupsWithGroup(g);
        } else {
            user.getUserGroups().forEach(ug -> {
                Group g = groupService.find(ug.getGroup().getResourceId());
                if (g == null) {
                    try {
                        Group newGroup = ug.getGroup();
                        newGroup.addUser(user);
                        g = groupService.createGroup(newGroup);
                    }
                    catch (GroupExistsConflictException e) {
                        // we just checked, this shouldn't happen
                        g = ug.getGroup();
                    }
                }
                ug.setGroup(g);
            });
        }
        // Cleanup any group changes before saving new state
        user.getOldUserGroups().forEach(userGroup -> {
            userGroupRepository.delete(userGroup);
        });
        user.clearOldUserGroups();

        return userRepository.save(user);
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
}