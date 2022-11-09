package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.EmailConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IRolesService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.jadira.usertype.spi.utils.lang.StringUtils;
import org.pac4j.core.authorization.authorizer.DefaultAuthorizers;
import org.pac4j.core.config.Config;
import org.pac4j.core.matching.matcher.Matcher;
import org.pac4j.springframework.security.web.CallbackFilter;
import org.pac4j.springframework.security.web.LogoutFilter;
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

import javax.servlet.Filter;
import java.util.Optional;

import static net.unicon.shibui.pac4j.Pac4jConfiguration.PAC4J_CLIENT_NAME;

@Configuration
@AutoConfigureOrder(-1)
@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
@AutoConfigureAfter(EmailConfiguration.class)
public class WebSecurity {   
    @Bean("webSecurityConfig")
    public WebSecurityConfigurerAdapter webSecurityConfigurerAdapter(final Config config, UserService userService,
                    IRolesService rolesService, Optional<EmailService> emailService,
                    Pac4jConfigurationProperties pac4jConfigurationProperties, IGroupService groupService) {
        return new Pac4jWebSecurityConfigurerAdapter(config, userService, rolesService, emailService, groupService,
                        pac4jConfigurationProperties);
    }

    @Order(100)
    public static class Pac4jWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
        private final Config config;
        private Optional<EmailService> emailService;
        private IGroupService groupService;
        private Pac4jConfigurationProperties pac4jConfigurationProperties;
        private IRolesService rolesService;
        private UserService userService;

        public Pac4jWebSecurityConfigurerAdapter(final Config config, UserService userService, IRolesService rolesService,
                        Optional<EmailService> emailService, IGroupService groupService, Pac4jConfigurationProperties pac4jConfigurationProperties) {
            this.config = config;
            this.userService = userService;
            this.rolesService = rolesService;
            this.emailService = emailService;
            this.groupService = groupService;
            this.pac4jConfigurationProperties = pac4jConfigurationProperties;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests().antMatchers("/unsecured/**/*").permitAll();

            // adding the authorizer bypasses the default behavior of checking CSRF in Pac4J's default securitylogic+defaultauthorizationchecker
            final SecurityFilter securityFilter = new SecurityFilter(this.config, PAC4J_CLIENT_NAME, DefaultAuthorizers.IS_AUTHENTICATED);

            // If the post logout URL is configured, setup the logout filter
            if (StringUtils.isNotEmpty(pac4jConfigurationProperties.getPostLogoutURL())){
                final LogoutFilter logoutFilter = new LogoutFilter(config);
                logoutFilter.setLocalLogout(Boolean.TRUE);
                logoutFilter.setSuffix("login"); // "logout" is redirected before we ever hit the filters - sent to /login?logout
                logoutFilter.setCentralLogout(Boolean.TRUE);
                logoutFilter.setDefaultUrl(pac4jConfigurationProperties.getPostLogoutURL());
                http.antMatcher("/**").addFilterBefore(logoutFilter, BasicAuthenticationFilter.class);
            }

            // add filters
            http.antMatcher("/**").addFilterBefore(getFilter(pac4jConfigurationProperties.getTypeOfAuth()), BasicAuthenticationFilter.class);
            http.antMatcher("/**").addFilterBefore(securityFilter, BasicAuthenticationFilter.class);

            // add the new user filter
            http.addFilterAfter(new AddNewUserFilter(pac4jConfigurationProperties, userService, rolesService, getPathMatcher("exclude-paths-matcher"), groupService, emailService), SecurityFilter.class);

            http.authorizeRequests().anyRequest().fullyAuthenticated();

            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
            http.csrf().disable();
            http.headers().frameOptions().disable();
        }

        private Matcher getPathMatcher(String name) {
            return config.getMatchers().get(name);
        }

        private Filter getFilter(String typeOfAuth) {
            switch (typeOfAuth) {
            case "SAML2":
                return new CallbackFilter(this.config);
            case "HEADER":
                final SecurityFilter securityFilterForHeader = new SecurityFilter(this.config, PAC4J_CLIENT_NAME);
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
            firewall.setAllowSemicolon(true);
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