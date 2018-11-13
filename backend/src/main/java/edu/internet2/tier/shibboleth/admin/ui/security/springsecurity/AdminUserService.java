package edu.internet2.tier.shibboleth.admin.ui.security.springsecurity;

import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminRole;
import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminUser;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import static java.util.stream.Collectors.toSet;

/**
 * Spring Security {@link UserDetailsService} implementation for local administration of admin users ins the system.
 *
 * @author Dmitriy Kopylenko
 */
@RequiredArgsConstructor
public class AdminUserService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser user = adminUserRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User [%s] is not found", username)));

        Set<GrantedAuthority> grantedAuthorities = user.getRoles().stream()
                .map(AdminRole::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(toSet());

        if (grantedAuthorities.isEmpty()) {
            throw new UsernameNotFoundException(String.format("No roles are defined for user [%s]", username));
        }

        return new User(user.getUsername(), user.getPassword(), grantedAuthorities);
    }
}

