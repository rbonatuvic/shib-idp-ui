package net.unicon.shibui.pac4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.apache.commons.lang3.RandomStringUtils;
import org.pac4j.saml.profile.SAML2Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;

import javax.mail.MessagingException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
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

    private Pac4jConfigurationProperties pac4jConfigurationProperties;

    private Pac4jConfigurationProperties.SAML2ProfileMapping saml2ProfileMapping;

    public AddNewUserFilter(Pac4jConfigurationProperties pac4jConfigurationProperties, UserRepository userRepository, RoleRepository roleRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        saml2ProfileMapping = this.pac4jConfigurationProperties.getSaml2ProfileMapping();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    private User buildAndPersistNewUserFromProfile(SAML2Profile profile) {
        Role noRole = roleRepository.findByName(ROLE_NONE).orElse(new Role(ROLE_NONE));
        roleRepository.save(noRole);

        User user = new User();
        user.getRoles().add(noRole);
        user.setUsername(getAttributeFromProfile(profile, "username"));
        user.setPassword(BCrypt.hashpw(RandomStringUtils.randomAlphanumeric(20), BCrypt.gensalt()));
        user.setFirstName(getAttributeFromProfile(profile, "firstName"));
        user.setLastName(getAttributeFromProfile(profile, "lastName"));
        user.setEmailAddress(getAttributeFromProfile(profile, "email"));
        User persistedUser = userRepository.save(user);
        if (logger.isDebugEnabled()) {
            logger.debug("Persisted new user:\n" + user);
        }
        return persistedUser;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        SAML2Profile profile = (SAML2Profile) authentication.getPrincipal();
        if (profile != null) {
            String username = getAttributeFromProfile(profile, "username");
            if (username != null) {
                Optional<User> persistedUser = userRepository.findByUsername(username);
                User user;
                if (!persistedUser.isPresent()) {
                    user = buildAndPersistNewUserFromProfile(profile);
                    try {
                        emailService.sendNewUserMail(username);
                    } catch (MessagingException e) {
                        logger.warn(String.format("Unable to send new user email for user [%s]", username), e);
                    }
                } else {
                    user = persistedUser.get();
                }
                if (user.getRole().equals(ROLE_NONE)) {
                    ((HttpServletResponse) response).sendRedirect("/unsecured/error.html");
                } else {
                    chain.doFilter(request, response); // else, user is in the system already, carry on
                }
            }
        }
    }

    @Override
    public void destroy() {
    }

    private String getAttributeFromProfile(SAML2Profile profile, String stringKey) {
        String attribute = null;
        switch (stringKey) {
            case "username":
                attribute = saml2ProfileMapping.getUsername();
                break;
            case "firstName":
                attribute = saml2ProfileMapping.getFirstName();
                break;
            case "lastName":
                attribute = saml2ProfileMapping.getLastName();
                break;
            case "email":
                attribute = saml2ProfileMapping.getEmail();
                break;
            default:
                // do we care? Not yet.
        }
        List<String> attributeList = (List<String>) profile.getAttribute(attribute);
        return attributeList.size() < 1 ? null : attributeList.get(0);
    }

    private byte[] getJsonResponseBytes(ErrorResponse eErrorResponse) throws IOException {
        String errorResponseJson = new ObjectMapper().writeValueAsString(eErrorResponse);
        return errorResponseJson.getBytes();
    }
}
