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
     * username,password,firstName,lastName,role
     *
     * Note that the password must be encrypted in the file using the system configured password encryption (by default,
     * bcrypt)
     */
    private Optional<Resource> userBootstrapResource;
}
