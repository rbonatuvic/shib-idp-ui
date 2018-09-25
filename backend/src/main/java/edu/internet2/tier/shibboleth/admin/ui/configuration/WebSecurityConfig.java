package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Web security configuration.
 *
 * Workaround for slashes in URL from [https://stackoverflow.com/questions/48453980/spring-5-0-3-requestrejectedexception-the-request-was-rejected-because-the-url]
 */
@EnableWebSecurity
public class WebSecurityConfig {

    @Value("${shibui.logout-url:/dashboard}")
    private String logoutUrl;

    @Value("${shibui.default-password:}")
    private String defaultPassword;

    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        return firewall;
    }

    @Bean
    @Profile("default")
    @ConditionalOnMissingBean(value = {WebSecurityConfigurerAdapter.class})
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
                if (defaultPassword != null && !"".equals(defaultPassword)) {
                    auth
                            .inMemoryAuthentication()
                            .withUser("user").password(defaultPassword).roles("USER");
                } else {
                    super.configure(auth);
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
}
