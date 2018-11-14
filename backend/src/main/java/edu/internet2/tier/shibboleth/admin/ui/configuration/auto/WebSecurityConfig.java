package edu.internet2.tier.shibboleth.admin.ui.configuration.auto;

import edu.internet2.tier.shibboleth.admin.ui.security.DefaultAuditorAware;
import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminRole;
import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminUser;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.AdminUserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.springsecurity.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.security.servlet.SpringBootWebSecurityConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;

/**
 * Web security configuration.
 * <p>
 * Workaround for slashes in URL from [https://stackoverflow.com/questions/48453980/spring-5-0-3-requestrejectedexception-the-request-was-rejected-because-the-url]
 */
@Configuration
@AutoConfigureBefore(SpringBootWebSecurityConfiguration.class)
@ConditionalOnMissingBean(WebSecurityConfigurerAdapter.class)
public class WebSecurityConfig {

    @Value("${shibui.logout-url:/dashboard}")
    private String logoutUrl;

    @Value("${shibui.default-password:}")
    private String defaultPassword;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        return firewall;
    }

    @Bean
    @Profile("!no-auth")
    public WebSecurityConfigurerAdapter defaultAuth() {
        return new WebSecurityConfigurerAdapter() {

            @Override
            protected void configure(HttpSecurity http) throws Exception {
                http
                        .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .and()
                        .authorizeRequests()
                        .anyRequest().authenticated()
                        .and()
                        .formLogin().and()
                        .httpBasic().and()
                        .logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl(logoutUrl);
            }

            @Override
            protected void configure(AuthenticationManagerBuilder auth) throws Exception {
                // TODO: more configurable authentication
                PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
                if (defaultPassword != null && !"".equals(defaultPassword)) {
                    auth
                            .inMemoryAuthentication()
                            .withUser("user")
                            .password(defaultPassword)
                            .roles("USER");
                } else {
                    auth.userDetailsService(adminUserService(adminUserRepository)).passwordEncoder(passwordEncoder);
                }
            }

            @Override
            public void configure(WebSecurity web) throws Exception {
                super.configure(web);
                web.httpFirewall(allowUrlEncodedSlashHttpFirewall());
            }
        };
    }

    @Bean
    @Profile("!no-auth")
    public AuditorAware<String> defaultAuditorAware() {
        return new DefaultAuditorAware();
    }

    @Bean
    @Profile("!no-auth")
    public AdminUserService adminUserService(AdminUserRepository adminUserRepository) {
        return new AdminUserService(adminUserRepository);
    }

    @Bean
    @Profile("no-auth")
    public WebSecurityConfigurerAdapter noAuthUsedForEaseDevelopment() {
        return new WebSecurityConfigurerAdapter() {
            @Override
            protected void configure(HttpSecurity http) throws Exception {
                http.csrf().disable();
                http.headers().frameOptions().disable();
            }

            @Override
            public void configure(WebSecurity web) throws Exception {
                super.configure(web);
                web.httpFirewall(allowUrlEncodedSlashHttpFirewall());
            }
        };
    }

    @Component
    @Profile("dev")
    public static class SampleAdminUsersCreator {

        @Autowired
        AdminUserRepository adminUserRepository;

        @Transactional
        @PostConstruct
        public void createSampleAdminUsers() {
            if (adminUserRepository.count() == 0L) {
                AdminRole role = new AdminRole();
                role.setName("ROLE_ADMIN");
                AdminUser user = new AdminUser();
                user.setUsername("admin");
                user.setPassword("{noop}adminpass");

                //The complexity of managing bi-directional many-to-many. TODO: encapsulate this association
                //managing logic into domain model itself
                role.getAdmins().add(user);
                user.getRoles().add(role);

                adminUserRepository.save(user);
            }
        }
    }
}

