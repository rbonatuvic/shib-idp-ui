package edu.internet2.tier.shibboleth.admin.ui.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.util.List;
import java.util.Optional;

@Configuration
@ConfigurationProperties(prefix = "shibui")
@Getter
@Setter
public class ShibUIConfiguration {
    /**
     * A list of namespaces that should be excluded from incoming metadata. This is used to prevent third party metadata
     * sources from using attributes that they might not have the rights to use.
     */
    private List<String> protectedAttributeNamespaces;

    /**
     * A Resource containing a CSV of users to bootstrap into the system. Currently, this must be in format
     *
     * <code>
     * username,password,firstName,lastName,role,email
     * </code>
     *
     * Note that the password must be encrypted in the file. Ensure that you prepend the encoder to the value, e.g.
     *
     * <code>
     * {bcrypt}$2a$10$ssM2LpFqceRQ/ta0JehGcu0BawFQDbxjQGSyVmKS6qa09hHLigtAO
     * </code>
     */
    private Resource userBootstrapResource;

    /**
     * A list of roles to bootstrap into the system.
     */
    private List<String> roles;
}
