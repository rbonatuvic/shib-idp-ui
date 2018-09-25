package net.unicon.shibui.pac4j;

import org.pac4j.core.config.Config;
import org.pac4j.springframework.security.web.CallbackFilter;
import org.pac4j.springframework.security.web.SecurityFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
public class WebSecurity {
    @Configuration
    @Order(1)
    public static class Pac4jSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {
        private static final Logger logger = LoggerFactory.getLogger(Pac4jSecurityConfigurationAdapter.class);

        private final Config config;

        public Pac4jSecurityConfigurationAdapter(Config config) {
            logger.info("configuring pac4j authentication");
            this.config = config;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            final SecurityFilter securityFilter = new SecurityFilter(this.config, "Saml2Client");

            final CallbackFilter callbackFilter = new CallbackFilter(this.config);
            http.antMatcher("/**").addFilterBefore(callbackFilter, BasicAuthenticationFilter.class);
            http.authorizeRequests().anyRequest().fullyAuthenticated();

            http.addFilterBefore(securityFilter, BasicAuthenticationFilter.class);
            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);

            http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        }
    }
}
