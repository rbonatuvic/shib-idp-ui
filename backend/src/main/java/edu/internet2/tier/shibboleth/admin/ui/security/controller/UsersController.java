package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.OwnershipConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;


/**
 * Implementation of the REST resource endpoints exposing system users.
 */
@RestController
@RequestMapping("/api/admin/users")
@Slf4j
@Tags(value = {@Tag(name = "admin")})
public class UsersController {
    private UserRepository userRepository;
    private UserService userService;

    public UsersController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteOne(@PathVariable String username) {
        try {
            userService.delete(username);
        }
        catch (PersistentEntityNotFound e) {
            throw new HttpClientErrorException(NOT_FOUND, String.format("User with username [%s] not found", username));
        }
        catch (OwnershipConflictException e) {
            throw new HttpClientErrorException(HttpStatus.CONFLICT, e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }

    private User findUserOrThrowHttp404(String username) {
        Optional<User> result = userRepository.findByUsername(username);
        return result.orElseThrow(() -> new HttpClientErrorException(NOT_FOUND, String.format("User with username [%s] not found", username)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    @GetMapping
    public List<User> getAll() {
        try {
            List<User> results = userRepository.findAll(); 
            return results;
        }
        catch (Exception e) {
            log.error("Unable to fetch users because: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional(readOnly = true)
    @GetMapping("/current")
    public User getCurrentUser(Principal principal) {
        // TODO: fix this
        return userService.getCurrentUser();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    @GetMapping("/{username}")
    public ResponseEntity<?> getOne(@PathVariable String username) {
        return ResponseEntity.ok(findUserOrThrowHttp404(username));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @GetMapping("/role/{rolename}")
    public ResponseEntity<?> getUsersWithRole(@PathVariable String rolename) {
        return ResponseEntity.ok(userRepository.findByRoles_Name(rolename));
    }

    @PreAuthorize("hasRole('ADMIN')")
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
        //TODO: modify this such that additional encoders can be used
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        userService.updateUserRole(user);
        
        User savedUser = userService.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @PatchMapping("/{username}")
    ResponseEntity<?> updateOne(@PathVariable(value = "username") String username, @RequestBody User user) {
        User persistedUser = findUserOrThrowHttp404(username);
        
        if (StringUtils.isNotBlank(user.getFirstName())) {
            persistedUser.setFirstName(user.getFirstName());
        }
        if (StringUtils.isNotBlank(user.getLastName())) {
            persistedUser.setLastName(user.getLastName());
        }
        if (StringUtils.isNotBlank(user.getEmailAddress())) {
            persistedUser.setEmailAddress(user.getEmailAddress());
        }
        if (StringUtils.isNotBlank(user.getPassword())) {
            persistedUser.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        }
        if (StringUtils.isNotBlank(user.getRole())) {
            if (!user.getRole().equals(persistedUser.getRole())) {
                persistedUser.setRole(user.getRole());
                userService.updateUserRole(persistedUser);
            }
        }
        persistedUser.setGroupId(user.getGroupId());
        User savedUser = userService.save(persistedUser);
        return ResponseEntity.ok(savedUser);
    }
 }