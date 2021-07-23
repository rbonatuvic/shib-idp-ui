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
    private Pac4jConfigurationProperties.SimpleProfileMapping simpleProfileMapping;
    private UserRepository userRepository;
    private Matcher matcher;

    public AddNewUserFilter(Pac4jConfigurationProperties pac4jConfigurationProperties, UserRepository userRepository, RoleRepository roleRepository, Matcher matcher, Optional<EmailService> emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        this.matcher = matcher;
        simpleProfileMapping = this.pac4jConfigurationProperties.getSimpleProfileMapping();
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
        user.setUsername(profile.getUsername());
        user.setPassword(BCrypt.hashpw(RandomStringUtils.randomAlphanumeric(20), BCrypt.gensalt()));
        user.setFirstName(profile.getFirstName());
        user.setLastName(profile.getFamilyName());
        user.setEmailAddress(profile.getEmail());
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
                String username = profile.getUsername();
                if (username != null) {
                    Optional<User> persistedUser = userRepository.findByUsername(username);
                    User user;
                    if (persistedUser.isEmpty()) {
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

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
}
