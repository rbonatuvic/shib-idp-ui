package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.pac4j.core.authorization.generator.AuthorizationGenerator;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.context.session.SessionStore;
import org.pac4j.core.profile.UserProfile;

import java.util.Optional;

public class LocalUserProfileAuthorizationGenerator implements AuthorizationGenerator {
    private final UserRepository userRepository;

    public LocalUserProfileAuthorizationGenerator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<UserProfile> generate(WebContext context, SessionStore sessionStore, UserProfile profile) {
        Optional<User> user = userRepository.findByUsername(profile.getUsername());
        user.ifPresent(u -> profile.addRole(u.getRole()));
        return Optional.of(profile);
    }
}