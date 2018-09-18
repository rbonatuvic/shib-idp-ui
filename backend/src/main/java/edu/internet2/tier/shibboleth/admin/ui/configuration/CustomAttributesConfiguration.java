package edu.internet2.tier.shibboleth.admin.ui.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Configuration
@ConfigurationProperties(prefix="custom")
public class CustomAttributesConfiguration {

    private List<HashMap<String, String>> attributes = new ArrayList<>();

    public List<HashMap<String, String>> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<HashMap<String, String>> attributes) {
        this.attributes = attributes;
    }
}
