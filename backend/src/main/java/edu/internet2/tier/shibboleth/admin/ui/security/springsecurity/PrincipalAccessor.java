package edu.internet2.tier.shibboleth.admin.ui.security.springsecurity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class PrincipalAccessor {

    //Non-instantiable utility class
    private PrincipalAccessor() {
    }

    public static Optional<String> currentPrincipalIfLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return Optional.empty();
        }
        return Optional.of(authentication.getName());
    }
}
