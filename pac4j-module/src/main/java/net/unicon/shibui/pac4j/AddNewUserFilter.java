package net.unicon.shibui.pac4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.http.entity.ContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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

    public AddNewUserFilter(UserRepository userRepository, RoleRepository roleRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String username = authentication.getName();
            if (username != null) {
                Optional<User> persistedUser = userRepository.findByUsername(username);
                User user;
                if (!persistedUser.isPresent()) {
                    user = new User();
                    user.setUsername(username);
                    user.setPassword(BCrypt.hashpw(RandomStringUtils.randomAlphanumeric(20), BCrypt.gensalt()));
                    Role noRole = roleRepository.findByName(ROLE_NONE).orElse(new Role(ROLE_NONE));
                    roleRepository.save(noRole);
                    user.getRoles().add(noRole);
                    userRepository.save(user);
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

    private byte[] getJsonResponseBytes(ErrorResponse eErrorResponse) throws IOException {
        String errorResponseJson = new ObjectMapper().writeValueAsString(eErrorResponse);
        return errorResponseJson.getBytes();
    }
}
