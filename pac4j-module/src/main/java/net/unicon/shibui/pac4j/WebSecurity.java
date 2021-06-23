package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.EmailConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.pac4j.core.config.Config;
import org.pac4j.springframework.security.web.CallbackFilter;
import org.pac4j.springframework.security.web.SecurityFilter;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.firewall.StrictHttpFirewall;

import javax.swing.text.html.Option;
import java.util.Optional;

@Configuration
@AutoConfigureOrder(-1)
@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
@AutoConfigureAfter(EmailConfiguration.class)

public class WebSecurity {
    @Bean("webSecurityConfig")
    public WebSecurityConfigurerAdapter webSecurityConfigurerAdapter(final Config config, UserRepository userRepository, RoleRepository roleRepository, Optional<EmailService> emailService, Pac4jConfigurationProperties pac4jConfigurationProperties) {
        return new Pac4jWebSecurityConfigurerAdapter(config, userRepository, roleRepository, emailService, pac4jConfigurationProperties);
    }

    @Configuration
    @Order(0)
    @ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
    public static class FaviconSecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.antMatcher("/favicon.ico").authorizeRequests().antMatchers("/favicon.ico").permitAll();
        }
    }

    @Configuration
    @Order(1)
    @ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
    public static class UnsecuredSecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.antMatcher("/unsecured/**/*").authorizeRequests().antMatchers("/unsecured/**/*").permitAll();
        }
    }

    @Configuration
    @Order(2)
    @ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
    public static class ErrorSecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.antMatcher("/error").authorizeRequests().antMatchers("/error").permitAll();
        }
    }

    @Order(100)
    public static class Pac4jWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
        private final Config config;
        private UserRepository userRepository;
        private RoleRepository roleRepository;
        private Optional<EmailService> emailService;
        private Pac4jConfigurationProperties pac4jConfigurationProperties;

        public Pac4jWebSecurityConfigurerAdapter(final Config config, UserRepository userRepository, RoleRepository roleRepository, Optional<EmailService> emailService, Pac4jConfigurationProperties pac4jConfigurationProperties) {
            this.config = config;
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.emailService = emailService;
            this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            final SecurityFilter securityFilterForHeader = new SecurityFilter(this.config, "HeaderClient");

            final CallbackFilter callbackFilter = new CallbackFilter(this.config);
            http.antMatcher("/**").addFilterBefore(callbackFilter, BasicAuthenticationFilter.class)
                    .addFilterBefore(securityFilterForHeader, BasicAuthenticationFilter.class)  //xxx check on this
                    .addFilterAfter(new AddNewUserFilter(pac4jConfigurationProperties, userRepository, roleRepository, emailService), SecurityFilter.class);

            http.authorizeRequests().anyRequest().fullyAuthenticated();
            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
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

    @Bean
    public AuditorAware<String> pac4jAuditorAware() {
        return new Pac4jAuditorAware();
    }
}
