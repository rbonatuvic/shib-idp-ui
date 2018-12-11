package edu.internet2.tier.shibboleth.admin.ui.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

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
}
