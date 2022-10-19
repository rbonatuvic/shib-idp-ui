package edu.internet2.tier.shibboleth.admin.ui.security.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.IActivatable;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.OwnershipConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnableType;
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnerType;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import static edu.internet2.tier.shibboleth.admin.ui.security.service.UserAccess.ADMIN;
import static edu.internet2.tier.shibboleth.admin.ui.security.service.UserAccess.GROUP;
import static edu.internet2.tier.shibboleth.admin.ui.security.service.UserAccess.NONE;
import lombok.NoArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@NoArgsConstructor
public class UserService {
    @Autowired
    private IGroupService groupService;

    @Autowired
    private OwnershipRepository ownershipRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    public UserService(IGroupService groupService, OwnershipRepository ownershipRepository, RoleRepository roleRepository, UserRepository userRepository) {
        this.groupService = groupService;
        this.ownershipRepository = ownershipRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    public boolean currentUserCanApprove(List<Group> approverGroups) {
        if (currentUserIsAdmin()) {
            return true;
        }
        Group currentUserGroup = getCurrentUserGroup();
        return approverGroups.contains(currentUserGroup);
    }

    public boolean currentUserCanEnable(IActivatable activatableObject) {
        if (currentUserIsAdmin()) { return true; }
        switch (activatableObject.getActivatableType()) {
        case ENTITY_DESCRIPTOR: {
            return currentUserHasExpectedRole(Arrays.asList("ROLE_ENABLE" )) && getCurrentUserGroup().getOwnerId().equals(((EntityDescriptor) activatableObject).getIdOfOwner());
        }
        // Currently filters and providers dont have ownership, so we just look for the right role
        case FILTER:
        case METADATA_RESOLVER:
            return currentUserHasExpectedRole(Arrays.asList("ROLE_ENABLE" ));
        default:
            return false;
        }
    }

    /**
     * This basic logic assumes users only have a single role (despite users having a list of roles, we assume only 1 currently)
     */
    private boolean currentUserHasExpectedRole(List<String> acceptedRoles) {
        User user = getCurrentUser();
        return acceptedRoles.contains(user.getRole());
    }

    public boolean currentUserIsAdmin() {
        User user = getCurrentUser();
        return user != null && user.getRole().equals("ROLE_ADMIN");
    }

    @Transactional
    public void delete(String username) throws PersistentEntityNotFound, OwnershipConflictException {
        Optional<User> userToRemove = userRepository.findByUsername(username);
        if (userToRemove.isEmpty()) throw new PersistentEntityNotFound("User does not exist");
        if (!ownershipRepository.findOwnedByUser(username).isEmpty()) throw new OwnershipConflictException("User ["+username+"] has ownership of entities in the system. Please remove all items before attempting to delete the user.");

        // ok, user exists and doesn't own anything in the system, so delete them
        // If the user is owned by anything, clear that first
        ownershipRepository.clearUsersGroups(username);
        User user = userToRemove.get();
        userRepository.delete(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
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
            return NONE;
        }
        if (user.getRole().equals("ROLE_ADMIN")) {
            return ADMIN;
        }
        if (user.getRole().equals("ROLE_USER") || user.getRole().equals("ROLE_ENABLE")) {
            return GROUP;
        }
        return NONE;
    }

    public Group getCurrentUserGroup() {
        switch (getCurrentUserAccess()) {
        case ADMIN:
            return Group.ADMIN_GROUP;
        default:
            return getCurrentUser().getGroup();
        }
    }

    /**
     * @return a list of ALL groups that the user can approve for (checks ALL the users groups)
     */
    public List<String> getGroupsCurrentUserCanApprove() {
        HashSet<String> fullSet = new HashSet<>();
        for (Group g : getCurrentUser().getUserGroups()) {
            fullSet.addAll(g.getApproveForList());
        }
        ArrayList<String> result = new ArrayList<>();
        result.addAll(fullSet);
        return result;
    }

    public Set<String> getUserRoles(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        HashSet<String> result = new HashSet<>();
        user.ifPresent(value -> value.getRoles().forEach(role -> result.add(role.getName())));
        return result;
    }

     // @TODO - probably delegate this out to something plugable at some point
    public boolean isAuthorizedFor(Ownable ownableObject) {
        switch (getCurrentUserAccess()) {
        case ADMIN: // Pure admin is authorized to do anything
            return true;
        case GROUP: // if the current user's group matches the object's group we are good.
            Set<Ownership> owners = ownershipRepository.findOwnableObjectOwners(ownableObject);
            String currentUsersGroupId = getCurrentUser().getGroupId();
            for (Ownership owner : owners) {
                if (currentUsersGroupId.equals(owner.getOwnerId()) && OwnerType.valueOf(owner.getOwnerType()) == OwnerType.GROUP) {
                    return true;
                }
            }
            return false;
        default: // Currently the only cases are ADMIN or GROUP
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
        if (user.getRole().equalsIgnoreCase("ROLE_ADMIN") || user.getUserGroups().size() < 2) {
            Group g;
            if (user.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
                g = groupService.find(Group.ADMIN_GROUP.getResourceId());
            } else if (user.getGroupId() == null) {
                // Find or create the "user's default" group
                g = new Group(user);
                try {
                    g = groupService.createGroup(g);
                }
                catch (GroupExistsConflictException | InvalidGroupRegexException e) {
                    // Invalid shouldn't happen for a group created this way.
                    g = groupService.find(user.getUsername());
                }
            } else {
                g = groupService.find(user.getGroupId());
            }
            ownershipRepository.clearUsersGroups(user.getUsername());
            ownershipRepository.saveAndFlush(new Ownership(g, user));
        } else {
            ownershipRepository.clearUsersGroups(user.getUsername());
            user.getUserGroups().forEach(ug -> {
                Group g = groupService.find(ug.getResourceId());
                if (g == null) {
                    try {
                        Group newGroup = ug;
                        ownershipRepository.saveAndFlush(new Ownership(newGroup, user));
                        g = groupService.createGroup(newGroup);
                    }
                    catch (GroupExistsConflictException | InvalidGroupRegexException e) {
                        // this shouldn't happen
                        g = ug;
                    }
                }
                ownershipRepository.saveAndFlush(new Ownership(g, user));
            });
        }
        return userRepository.saveAndFlush(user);
    }

    /**
     * Given a user with a defined User.role, update the User.roles collection with that role.
     *
     * This currently exists because users should only ever have one role in the system at this time. However, user
     * roles are persisted as a set of roles (for future-proofing). Once we start allowing a user to have multiple roles,
     * this method and User.role can go away.
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
            throw new RuntimeException(String.format("User with username [%s] has no role defined and therefore cannot be updated!", user.getUsername()));
        }
    }
}