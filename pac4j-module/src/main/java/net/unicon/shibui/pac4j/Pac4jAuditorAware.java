package net.unicon.shibui.pac4j;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
public class Pac4jAuditorAware implements AuditorAware<String> {

    private static final String ANONYMOUS = "anonymousUser";

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return Optional.of(ANONYMOUS);
        }
        return Optional.of(authentication.getName());
    }
}
