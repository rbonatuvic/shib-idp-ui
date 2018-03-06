package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableWebSecurity
public class WebSecurityConfig {

    @Value("${shibui.logout-url:/dashboard}")
    private String logoutUrl;

    @Value("${shibui.default-password:}")
    private String defaultPassword;

    @Bean
    @Profile("default")
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
        };
    }
}
