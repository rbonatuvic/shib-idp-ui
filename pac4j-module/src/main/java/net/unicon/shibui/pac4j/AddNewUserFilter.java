package net.unicon.shibui.pac4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;

import org.apache.commons.lang3.RandomStringUtils;
import org.pac4j.core.context.JEEContext;
import org.pac4j.core.context.session.JEESessionStore;
import org.pac4j.core.matching.matcher.Matcher;
import org.pac4j.core.profile.CommonProfile;
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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AddNewUserFilter implements Filter {
    private static final String ROLE_NONE = "ROLE_NONE";

    private Optional<EmailService> emailService;
    private Pac4jConfigurationProperties pac4jConfigurationProperties;
    private RoleRepository roleRepository;
    private Pac4jConfigurationProperties.SAML2ProfileMapping saml2ProfileMapping;
    private UserRepository userRepository;
    private Matcher matcher;

    public AddNewUserFilter(Pac4jConfigurationProperties pac4jConfigurationProperties, UserRepository userRepository, RoleRepository roleRepository, Matcher matcher, Optional<EmailService> emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        this.matcher = matcher;
        saml2ProfileMapping = this.pac4jConfigurationProperties.getSaml2ProfileMapping();
    }

    @Transactional
    private User buildAndPersistNewUserFromProfile(CommonProfile profile) {
        Optional<Role> noRole = roleRepository.findByName(ROLE_NONE);
        Role newUserRole;
        if (noRole.isEmpty()) {
            newUserRole = new Role(ROLE_NONE);
            newUserRole = roleRepository.save(newUserRole);
        }
        newUserRole = noRole.get();

        User user = new User();
        user.getRoles().add(newUserRole);
        user.setUsername(getAttributeFromProfile(profile, "username"));
        user.setPassword(BCrypt.hashpw(RandomStringUtils.randomAlphanumeric(20), BCrypt.gensalt()));
        user.setFirstName(getAttributeFromProfile(profile, "firstName"));
        user.setLastName(getAttributeFromProfile(profile, "lastName"));
        user.setEmailAddress(getAttributeFromProfile(profile, "email"));
        User persistedUser = userRepository.save(user);
        if (log.isDebugEnabled()) {
            log.debug("Persisted new user:\n" + user);
        }
        return persistedUser;
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        JEEContext context = new JEEContext((HttpServletRequest)request, (HttpServletResponse)response);
        if (!matcher.matches(context, JEESessionStore.INSTANCE)) {
            return;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            CommonProfile profile = (CommonProfile) authentication.getPrincipal();
            if (profile != null) {
                String username = getAttributeFromProfile(profile, "username");
                if (username != null) {
                    Optional<User> persistedUser = userRepository.findByUsername(username);
                    User user;
                    if (!persistedUser.isPresent()) {
                        user = buildAndPersistNewUserFromProfile(profile);
                        emailService.ifPresent(e -> {
                            try {
                                e.sendNewUserMail(username);
                            }
                            catch (MessagingException e1) {
                                log.warn(String.format("Unable to send new user email for user [%s]", username), e);
                            }
                        });
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
    }

    private String getAttributeFromProfile(CommonProfile profile, String stringKey) {
        if (profile instanceof SAML2Profile) {
            return getAttributeFromSAML2Profile(profile, stringKey);
        }
        return stringKey.equalsIgnoreCase("username") ? profile.getId() : null;
    }
    
    @SuppressWarnings("unchecked")
    private String getAttributeFromSAML2Profile(CommonProfile profile, String stringKey) {
        String attributeKey = null;
        switch (stringKey) {
            case "username":
                attributeKey = saml2ProfileMapping.getUsername();
                break;
            case "firstName":
                attributeKey = saml2ProfileMapping.getFirstName();
                break;
            case "lastName":
                attributeKey = saml2ProfileMapping.getLastName();
                break;
            case "email":
                attributeKey = saml2ProfileMapping.getEmail();
                break;
            default:
                // do we care? Not yet.
        }
        List<String> attributeList = (List<String>) profile.getAttribute(attributeKey);
        return attributeList.size() < 1 ? null : attributeList.get(0);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
}
