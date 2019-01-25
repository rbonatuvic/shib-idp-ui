package net.unicon.shibui.pac4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.pac4j.saml.profile.SAML2Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.mail.MessagingException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class AddNewUserFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(AddNewUserFilter.class);

    private static final String ROLE_NONE = "ROLE_NONE";

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private EmailService emailService;

    private CustomPropertiesConfiguration customPropertiesConfiguration;

    private Map<String, String> saml2ProfileMapping;

    public AddNewUserFilter(CustomPropertiesConfiguration customPropertiesConfiguration, UserRepository userRepository, RoleRepository roleRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.customPropertiesConfiguration = customPropertiesConfiguration;
        saml2ProfileMapping = this.customPropertiesConfiguration.getSaml2ProfileMapping();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    private User buildAndPersistNewUserFromProfile(Map<String, Object> attributes) {
        Role noRole = roleRepository.findByName(ROLE_NONE).orElse(new Role(ROLE_NONE));
        roleRepository.save(noRole);

        User user = new User();
        user.getRoles().add(noRole);
        user.setUsername((String) attributes.get(saml2ProfileMapping.get("username")));
        user.setFirstName((String) attributes.get(saml2ProfileMapping.get("firstName")));
        user.setLastName((String) attributes.get(saml2ProfileMapping.get("lastName")));
        user.setEmailAddress((String) attributes.get(saml2ProfileMapping.get("email")));
        userRepository.save(user);
        return user;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        SAML2Profile profile = (SAML2Profile) authentication.getPrincipal();
        if (profile != null) {
            String username = (String) profile.getAttribute(saml2ProfileMapping.get("username"));
            if (username != null) {
                Optional<User> persistedUser = userRepository.findByUsername(username);
                User user;
                if (!persistedUser.isPresent()) {
                    user = buildAndPersistNewUserFromProfile(profile.getAttributes());
                    try {
                        emailService.sendNewUserMail(username);
                    } catch (MessagingException e) {
                        logger.warn(String.format("Unable to send new user email for user [%s]", username), e);
                    }
                } else {
                    user = persistedUser.get();
                }
                if (user.getRole().equals(ROLE_NONE)) {
                    ((HttpServletResponse) response).sendRedirect("/static.html");
                } else {
                    chain.doFilter(request, response); // else, user is in the system already, carry on
                }
            }
        }
    }

    @Override
    public void destroy() {
    }

    private byte[] getJsonResponseBytes(ErrorResponse eErrorResponse) throws IOException {
        String errorResponseJson = new ObjectMapper().writeValueAsString(eErrorResponse);
        return errorResponseJson.getBytes();
    }
}
