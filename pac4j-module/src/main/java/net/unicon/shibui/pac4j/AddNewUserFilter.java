package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.pac4j.core.context.J2EContext;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.matching.Matcher;
import org.pac4j.core.profile.CommonProfile;
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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
public class AddNewUserFilter implements Filter {
    private static final String ROLE_NONE = "ROLE_NONE";

    private Optional<EmailService> emailService;
    private IGroupService groupService;
    private Matcher matcher;
    private Pac4jConfigurationProperties pac4jConfigurationProperties;
    private RoleRepository roleRepository;
    private Pac4jConfigurationProperties.SimpleProfileMapping simpleProfileMapping;
    private UserService userService;

    public AddNewUserFilter(Pac4jConfigurationProperties pac4jConfigurationProperties, UserService userService, RoleRepository roleRepository, Matcher matcher, IGroupService groupService, Optional<EmailService> emailService) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        this.matcher = matcher;
        this.groupService = groupService;
        simpleProfileMapping = this.pac4jConfigurationProperties.getSimpleProfileMapping();
    }

    @Transactional
    User buildAndPersistNewUserFromProfile(CommonProfile profile) {
        Optional<Role> noRole = roleRepository.findByName(ROLE_NONE);
        Role newUserRole;
        if (noRole.isEmpty()) {
            newUserRole = new Role(ROLE_NONE);
            roleRepository.save(newUserRole);
        }
        newUserRole = noRole.get();

        User user = new User();
        user.getRoles().add(newUserRole);
        user.setUsername(profile.getUsername());
        user.setPassword(BCrypt.hashpw(RandomStringUtils.randomAlphanumeric(20), BCrypt.gensalt()));
        user.setFirstName(profile.getFirstName());
        user.setLastName(profile.getFamilyName());
        user.setEmailAddress(profile.getEmail());

        // get profile attribute for groups
        Object obj = profile.getAttribute(simpleProfileMapping.getGroups());
        if (obj != null) {
            final ArrayList<String> groupNames = new ArrayList<>();
            if (obj instanceof String) {
                groupNames.add(obj.toString());
            }
            if (obj instanceof List) {
                ((List)obj).forEach(val -> groupNames.add(val.toString()));
            }
            if (!groupNames.isEmpty()) {
                user.setUserGroups(findOrCreateGroups(groupNames));
            }
        }

        User persistedUser = userService.save(user);
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
        WebContext context = new J2EContext((HttpServletRequest)request, (HttpServletResponse)response);
        if (!matcher.matches(context)) {
            return;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            CommonProfile profile = (CommonProfile) authentication.getPrincipal();
            if (profile != null) {
                String username = profile.getUsername();
                if (username != null) {
                    Optional<User> persistedUser = userService.findByUsername(username);
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

    private Set<Group> findOrCreateGroups(ArrayList<String> groupNames) {
        final HashSet<Group> result = new HashSet<>();
        groupNames.forEach(name -> {
            Group g = groupService.find(name);
            if (g == null) {
                g = new Group();
                g.setResourceId(name);
                g.setName(name);
                try {
                    groupService.createGroup(g);
                }
                catch (GroupExistsConflictException shouldntHappen) {
                }
            }
            result.add(g);
        });
        return result;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
}