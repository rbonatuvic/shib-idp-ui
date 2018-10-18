package edu.internet2.tier.shibboleth.admin.ui.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.Optional;

/**
 * Default implementation of Spring Data's <code>AuditorAware</code> SPI to let Spring Data
 * plug in authenticated principal's id to <code>@CreatedBy</code> and <code>@LastModifiedBy</code>
 * fields of Auditable entities.
 *
 * @author Dmitriy Kopylenko
 */
public class DefaultAuditorAware implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        return Optional.of(User.class.cast(authentication.getPrincipal()).getUsername());
    }
}
