package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

/**
 * Implementation of the REST resource endpoints exposing system users.
 *
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping("/api/admin/users")
public class UsersController {

    private UserRepository userRepository;

    public UsersController(UserRepository userRepository) {
        this.userRepository = userRepository;
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


    private User findUserOrThrowHttp404(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new HttpClientErrorException(NOT_FOUND, String.format("User with username [%s] not found", username)));
    }

 }
