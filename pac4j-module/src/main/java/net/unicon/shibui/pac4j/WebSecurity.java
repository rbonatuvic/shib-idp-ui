package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.pac4j.core.config.Config;
import org.pac4j.springframework.security.web.CallbackFilter;
import org.pac4j.springframework.security.web.SecurityFilter;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
@AutoConfigureOrder(-1)
public class WebSecurity {
    @Bean("webSecurityConfig")
    public WebSecurityConfigurerAdapter webSecurityConfigurerAdapter(final Config config, UserRepository userRepository, RoleRepository roleRepository) {
        return new Pac4jWebSecurityConfigurerAdapter(config, userRepository, roleRepository);
    }

    @Bean
    public static AccessDeniedHandler accessDeniedHandler() {
        return new net.unicon.shibui.pac4j.AccessDeniedHandler();
    }

    @Bean
    public static ExceptionTranslationFilter exceptionTranslationFilter(AccessDeniedHandler accessDeniedHandler) {
        ExceptionTranslationFilter exceptionTranslationFilter = new ExceptionTranslationFilter(new RestAuthenticationEntryPoint());
        exceptionTranslationFilter.setAccessDeniedHandler(accessDeniedHandler);
        exceptionTranslationFilter.afterPropertiesSet();
        return exceptionTranslationFilter;
    }

    @Configuration
    @Order(0)
    public static class FaviconSecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.antMatcher("/favicon.ico").authorizeRequests().antMatchers("/favicon.ico").permitAll();
        }
    }

    @Order(1)
    public static class Pac4jWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
        private final Config config;
        private UserRepository userRepository;
        private RoleRepository roleRepository;

        public Pac4jWebSecurityConfigurerAdapter(final Config config, UserRepository userRepository, RoleRepository roleRepository) {
            this.config = config;
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            final SecurityFilter securityFilter = new SecurityFilter(this.config, "Saml2Client");

            final CallbackFilter callbackFilter = new CallbackFilter(this.config);
            // http.regexMatcher("/callback").addFilterBefore(callbackFilter, BasicAuthenticationFilter.class);
            http.antMatcher("/**").addFilterBefore(callbackFilter, BasicAuthenticationFilter.class);
            http.authorizeRequests().anyRequest().fullyAuthenticated();

            http.addFilterBefore(securityFilter, BasicAuthenticationFilter.class);

            http.addFilterAfter(new AddNewUserFilter(userRepository, roleRepository), SecurityFilter.class);
/*
                    .exceptionHandling().accessDeniedHandler(accessDeniedHandler());
            http.addFilterAfter(exceptionTranslationFilter(accessDeniedHandler()), ExceptionTranslationFilter.class);
*/
/*
            ExceptionTranslationFilter customExceptionTranslationFilter = new ExceptionTranslationFilter(new RestAuthenticationEntryPoint());
            customExceptionTranslationFilter.setAccessDeniedHandler(accessDeniedHandler);
            http.addFilterAfter(customExceptionTranslationFilter, AddNewUserFilter.class);
*/

            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);

            // http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());

            http.csrf().disable();
            http.headers().frameOptions().disable();
        }

        @Override
        public void configure(org.springframework.security.config.annotation.web.builders.WebSecurity web) throws Exception {
            super.configure(web);

            StrictHttpFirewall firewall = new StrictHttpFirewall();
            firewall.setAllowUrlEncodedSlash(true);
            web.httpFirewall(firewall);
        }
    }
}
