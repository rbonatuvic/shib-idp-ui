package edu.internet2.tier.shibboleth.admin.ui.security.springsecurity;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import static java.util.stream.Collectors.toSet;

/**
 * Spring Security {@link UserDetailsService} implementation for local administration of admin users in the system.
 *
 * @author Dmitriy Kopylenko
 */
@RequiredArgsConstructor
public class AdminUserService implements UserDetailsService {

    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User [%s] is not found", username)));

        Set<GrantedAuthority> grantedAuthorities = user.getRoles().stream()
                .map(Role::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(toSet());

        if (grantedAuthorities.isEmpty()) {
            //As defined by the UserDetailsService API contract
            throw new UsernameNotFoundException(String.format("No roles are defined for user [%s]", username));
        }

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), grantedAuthorities);
    }
}