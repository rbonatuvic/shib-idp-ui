package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
<<<<<<< Updated upstream
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
=======
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
>>>>>>> Stashed changes
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;

/**
 * Implementation of the REST resource endpoints exposing system users.
 *
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping("/api/admin")
public class UsersController {

    private UserRepository userRepository;

    public UsersController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    @GetMapping("/users")
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getOne(@PathVariable String username) {
        return ResponseEntity.ok(findUserOrThrowHttp404(username));
    }

    @Transactional
    @DeleteMapping("/user/{username}")
    public ResponseEntity<?> deleteOne(@PathVariable String username) {
        User user = findUserOrThrowHttp404(username);
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }


    private User findUserOrThrowHttp404(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new HttpClientErrorException(NOT_FOUND, String.format("User with username [%s] not found", username)));
    }

    @Transactional
    @PostMapping("/user")
    ResponseEntity<?> saveOne(@RequestParam User user) {
        Optional<User> persistedUser = userRepository.findByUsername(user.getUsername());
        if (persistedUser.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()),
                            String.format("A user with username [ %s ] already exists within the system.", user.getUsername())));
        }
        //TODO: encrypt password?
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @Transactional
    @PutMapping("/user/{username}")
    ResponseEntity<?> updateOne(@PathVariable(value = "username") String username, @RequestParam User user) {
        Optional<User> userSearchResult = userRepository.findByUsername(username);
        if (!userSearchResult.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(String.valueOf(HttpStatus.BAD_REQUEST.value()),
                            String.format("No user with username [ %s ] exists within the system.", username)));
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User persistedUser = userSearchResult.get();
        persistedUser.setPassword(passwordEncoder.encode(user.getPassword());
        persistedUser.setFirstName(user.getFirstName());
        persistedUser.setLastName(user.getLastName());
        persistedUser.setRoles(user.getRoles());
        User savedUser = userRepository.save(persistedUser);
        return ResponseEntity.ok(savedUser);
    }
 }
