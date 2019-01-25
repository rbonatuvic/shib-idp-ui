package net.unicon.shibui.pac4j;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Component
@ConfigurationProperties(prefix="custom")
@EnableConfigurationProperties
public class CustomPropertiesConfiguration {

    private Map<String, String> saml2ProfileMapping;

    public Map<String, String> getSaml2ProfileMapping() {
        return saml2ProfileMapping;
    }

    public void setSaml2ProfileMapping(Map<String, String> saml2ProfileMapping) {
        this.saml2ProfileMapping = saml2ProfileMapping;
    }
}
