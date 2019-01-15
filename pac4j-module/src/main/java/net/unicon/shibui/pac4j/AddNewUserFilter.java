package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class AddNewUserFilter implements Filter {

    private UserRepository userRepository;

    public AddNewUserFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        Principal principal =  ((HttpServletRequest) request).getUserPrincipal();
        String username = principal.getName();
        System.out.println("WOO! Principal: " + username);

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
