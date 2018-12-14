package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.HttpStatus.NOT_FOUND;

/**
 * Implementation of the REST resource endpoints exposing system users.
 *
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping("/api/admin/users")
public class UsersController {

    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    private UserRepository userRepository;
    private RoleRepository roleRepository;

    public UsersController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    @GetMapping("/{username}")
    public ResponseEntity<?> getOne(@PathVariable String username) {
        return ResponseEntity.ok(findUserOrThrowHttp404(username));
    }

    @Transactional
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteOne(@PathVariable String username) {
        User user = findUserOrThrowHttp404(username);
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PostMapping
    ResponseEntity<?> saveOne(@RequestBody User user) {
        Optional<User> persistedUser = userRepository.findByUsername(user.getUsername());
        if (persistedUser.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()),
                            String.format("A user with username [%s] already exists within the system.", user.getUsername())));
        }
        user.setRoles(getPersistedRoles(user.getUsername(), user.getRoles()));
        //TODO: encrypt password? Or is it sent to us encrypted?
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @Transactional
    @PutMapping("/{username}")
    ResponseEntity<?> updateOne(@PathVariable(value = "username") String username, @RequestBody User user) {
        User persistedUser = findUserOrThrowHttp404(username);
        persistedUser.setPassword(user.getPassword()); //TODO: encrypt password?
        persistedUser.setFirstName(user.getFirstName());
        persistedUser.setLastName(user.getLastName());
        persistedUser.setEmailAddress(user.getEmailAddress());
        persistedUser.setRoles(getPersistedRoles(user.getUsername(), user.getRoles()));
        User savedUser = userRepository.save(persistedUser);
        return ResponseEntity.ok(savedUser);
    }

    private Set<Role> getPersistedRoles(String username, Set<Role> userRolesToBeUpdated) {
        Set<Role> newRoles = new HashSet<>();
        for (Role role : userRolesToBeUpdated) {
            Optional<Role> persistedRole = roleRepository.findByName(role.getName());
            if (!persistedRole.isPresent()) {
                logger.warn("Role [%s] is not present in the system. Not setting role for user [%s].", role.getName(), username);
                continue;
            }
            newRoles.add(persistedRole.get());
        }
       return newRoles;
    }

    private User findUserOrThrowHttp404(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new HttpClientErrorException(NOT_FOUND, String.format("User with username [%s] not found", username)));
    }
 }
