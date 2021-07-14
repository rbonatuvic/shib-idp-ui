package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.EmailConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;

import org.apache.commons.lang3.StringUtils;
import org.pac4j.core.config.Config;
import org.pac4j.core.matching.matcher.Matcher;
import org.pac4j.core.matching.matcher.PathMatcher;
import org.pac4j.springframework.security.web.CallbackFilter;
import org.pac4j.springframework.security.web.SecurityFilter;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.util.Optional;

import javax.servlet.Filter;

@Configuration
@AutoConfigureOrder(-1)
@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
@AutoConfigureAfter(EmailConfiguration.class)
public class WebSecurity {   
    @Bean("webSecurityConfig")
    public WebSecurityConfigurerAdapter webSecurityConfigurerAdapter(final Config config, UserRepository userRepository,
                    RoleRepository roleRepository, Optional<EmailService> emailService,
                    Pac4jConfigurationProperties pac4jConfigurationProperties) {
        return new Pac4jWebSecurityConfigurerAdapter(config, userRepository, roleRepository, emailService,
                        pac4jConfigurationProperties);
    }

    @Order(100)
    public static class Pac4jWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
        private final Config config;
        private UserRepository userRepository;
        private RoleRepository roleRepository;
        private Optional<EmailService> emailService;
        private Pac4jConfigurationProperties pac4jConfigurationProperties;

        public Pac4jWebSecurityConfigurerAdapter(final Config config, UserRepository userRepository, RoleRepository roleRepository,
                        Optional<EmailService> emailService, Pac4jConfigurationProperties pac4jConfigurationProperties) {
            this.config = config;
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.emailService = emailService;
            this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests().antMatchers("/unsecured/**/*").permitAll();
            
            // add filter based on auth type 
            http.antMatcher("/**").addFilterBefore(getFilter(config, pac4jConfigurationProperties.getTypeOfAuth()), BasicAuthenticationFilter.class);
            
            // add the new user filter
            http.addFilterAfter(new AddNewUserFilter(pac4jConfigurationProperties, userRepository, roleRepository, getPathMatcher("exclude-paths-matcher") , emailService), SecurityFilter.class);
            
            http.exceptionHandling().accessDeniedHandler((request, response, accessDeniedException) -> response.sendRedirect("/unsecured/error.html"));
            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
            http.csrf().disable();
            http.headers().frameOptions().disable();
        }

        private Matcher getPathMatcher(String name) {
            return config.getMatchers().get(name);
        }

        private Filter getFilter(Config config2, String typeOfAuth) {
            switch (typeOfAuth) {
            case "SAML2":
                return new CallbackFilter(this.config);
            case "HEADER":
                final SecurityFilter securityFilterForHeader = new SecurityFilter(this.config, Pac4jConfiguration.PAC4J_CLIENT_NAME);
                securityFilterForHeader.setMatchers("exclude-paths-matcher");
                return securityFilterForHeader;
            }
            return null; // This will cause a runtime error
        }

        @Override
        public void configure(org.springframework.security.config.annotation.web.builders.WebSecurity web) throws Exception {
            super.configure(web);

            StrictHttpFirewall firewall = new StrictHttpFirewall();
            firewall.setAllowUrlEncodedSlash(true);
            firewall.setAllowUrlEncodedDoubleSlash(true);
            web.httpFirewall(firewall);
   
            // These don't need to be secured
            web.ignoring().antMatchers("/favicon.ico", "/unsecured/**/*", "/assets/**/*.png", "/static/**/*", "/**/*.css"); 
        }
    }

    @Bean
    public AuditorAware<String> pac4jAuditorAware() {
        return new Pac4jAuditorAware();
    }
}
