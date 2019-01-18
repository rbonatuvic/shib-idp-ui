package net.unicon.shibui.pac4j;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.http.entity.ContentType;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;

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

    private static final String ROLE_NONE = "ROLE_NONE";

    private UserRepository userRepository;
    private RoleRepository roleRepository;

    public AddNewUserFilter(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
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
                    //TODO: Add call to email service here
                } else {
                    user = persistedUser.get();
                }
                if (user.getRole().equals(ROLE_NONE)) {
//                    throw new AccessDeniedException("DENIED!");
                    response.setContentType(ContentType.APPLICATION_JSON.getMimeType());
                    ((HttpServletResponse) response).setStatus(HttpStatus.FORBIDDEN.value());
                    response.getOutputStream().write(getJsonResponseBytes(
                            new ErrorResponse(String.valueOf(HttpStatus.FORBIDDEN.value()),
                                    "Your account is not yet authorized to access ShibUI.")));
                    ((HttpServletResponse) response).sendRedirect("/static.html");
                    return;
                } // else, user is in the system already, carry on
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }

    private byte[] getJsonResponseBytes(ErrorResponse eErrorResponse) throws IOException {
        String errorResponseJson = new ObjectMapper().writeValueAsString(eErrorResponse);
        return errorResponseJson.getBytes();
    }
}
