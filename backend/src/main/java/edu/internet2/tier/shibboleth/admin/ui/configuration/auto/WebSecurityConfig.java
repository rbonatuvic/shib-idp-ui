package edu.internet2.tier.shibboleth.admin.ui.configuration.auto;

import edu.internet2.tier.shibboleth.admin.ui.security.DefaultAuditorAware;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.security.springsecurity.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
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
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.util.Collections;

import javax.transaction.Transactional;

/**
 * Web security configuration.
 */
@Configuration
@ConditionalOnMissingBean(WebSecurityConfigurerAdapter.class)
public class WebSecurityConfig {

    @Value("${shibui.logout-url:/dashboard}")
    private String logoutUrl;

    @Value("${shibui.default-password:}")
    private String defaultPassword;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleRepository roleRepository;

    private HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowUrlEncodedDoubleSlash(true);
        return firewall;
    }

    private HttpFirewall defaultFirewall() {
        return new DefaultHttpFirewall();
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
                        .antMatchers("/unsecured/**/*").permitAll()
                        .anyRequest().hasAnyRole("USER", "ADMIN")
                        .and()
                        .exceptionHandling().accessDeniedHandler((request, response, accessDeniedException) -> response.sendRedirect("/unsecured/error.html"))
                        .and()
                        .formLogin().and()
                        .httpBasic().and()
                        .logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl(logoutUrl);
            }

            @Override
            @Transactional
            protected void configure(AuthenticationManagerBuilder auth) throws Exception {
                // TODO: more configurable authentication
                PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
                if (defaultPassword != null && !"".equals(defaultPassword)) {
                    // TODO: yeah, this isn't good, but we gotta initialize this user for now
                    User adminUser = userRepository.findByUsername("root").orElseGet(() ->{
                        User u = new User();
                        u.setUsername("root");
                        u.setPassword(defaultPassword);
                        u.setFirstName("admin");
                        u.setLastName("user");
                        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
                            Role r = new Role();
                            r.setName("ROLE_ADMIN");
                            return roleRepository.saveAndFlush(r);
                        });
                        u.setRoles(Collections.singleton(adminRole));
                        u.setEmailAddress("admin@localhost");
                        return userService.save(u);
                    });
                    adminUser.setPassword(defaultPassword);
                    userService.save(adminUser);

                    auth
                            .inMemoryAuthentication()
                            .withUser("root")
                            .password(defaultPassword)
                            .roles("ADMIN");
                }
                auth.userDetailsService(adminUserService(userRepository)).passwordEncoder(passwordEncoder);
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
    public AdminUserService adminUserService(UserRepository userRepository) {
        return new AdminUserService(userRepository);
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
                //Switch to the default firewall
                web.httpFirewall(defaultFirewall());
            }
        };
    }
}

