package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Configuration
@ConfigurationProperties(prefix="custom")
public class CustomAttributesConfiguration {

    private List<? extends Map<String, String>> attributes = new ArrayList<>();

    public List<? extends Map<String, String>> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<? extends Map<String, String>> attributes) {
        this.attributes = attributes;
    }
}
