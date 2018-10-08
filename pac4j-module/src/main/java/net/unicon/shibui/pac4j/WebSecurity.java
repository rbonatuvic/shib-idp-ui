package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.WebSecurityConfig;
import org.pac4j.core.config.Config;
import org.pac4j.springframework.security.web.CallbackFilter;
import org.pac4j.springframework.security.web.SecurityFilter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
@AutoConfigureBefore(WebSecurityConfig.class)
public class WebSecurity {
    @Bean("webSecurityConfig")
    public WebSecurityConfigurerAdapter webSecurityConfigurerAdapter(final Config config) {
        return new Pac4jWebSecurityConfigurerAdapter(config);
    }

    @Configuration
    @Order(0)
    public static class FaviconSecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests().antMatchers("/favicon.ico").permitAll();
        }
    }

    @Order(1)
    public static class Pac4jWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
        private final Config config;

        public Pac4jWebSecurityConfigurerAdapter(final Config config) {
            this.config = config;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            final SecurityFilter securityFilter = new SecurityFilter(this.config, "Saml2Client");

            final CallbackFilter callbackFilter = new CallbackFilter(this.config);
            // http.regexMatcher("/callback").addFilterBefore(callbackFilter, BasicAuthenticationFilter.class);
            http.antMatcher("/**").addFilterBefore(callbackFilter, BasicAuthenticationFilter.class);
            http.authorizeRequests().anyRequest().fullyAuthenticated();

            http.addFilterBefore(securityFilter, BasicAuthenticationFilter.class);
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
