package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.pac4j.core.authorization.generator.AuthorizationGenerator;
import org.pac4j.core.context.WebContext;
import org.pac4j.saml.profile.SAML2Profile;

import java.util.Optional;

public class SAML2ModelAuthorizationGenerator implements AuthorizationGenerator<SAML2Profile> {
    private final UserRepository userRepository;

    public SAML2ModelAuthorizationGenerator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public SAML2Profile generate(WebContext context, SAML2Profile profile) {
        Optional<User> user = userRepository.findByUsername(profile.getId());
        user.ifPresent( u -> profile.addRole(u.getRole()));
        return profile;
    }
}
