package edu.internet2.tier.shibboleth.admin.ui.security.filter;

import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

public class NoneRoleFilter implements Filter {
    private final UserRepository userRepository;

    private static final String ROLE_NONE = "ROLE_HONE";

    public NoneRoleFilter(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Optional<User> user = userRepository.findByUsername(authentication.getName());
            if (user.isPresent()) {
                if (!user.get().getRole().equals(ROLE_NONE)) {
                    chain.doFilter(request, response);
                    return;
                }
            }
        }
        ((HttpServletResponse)response).sendRedirect("/unsecured/error.html");
    }

    @Override
    public void destroy() {

    }
}
