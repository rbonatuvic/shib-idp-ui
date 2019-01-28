package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Configuration
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true)
public class EndpointSecurityConfiguration extends GlobalMethodSecurityConfiguration {
}
