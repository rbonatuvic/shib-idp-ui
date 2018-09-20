package net.unicon.shibui.pac4j;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurity {
    @Configuration
    public static class Pac4jSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {

    }
}
