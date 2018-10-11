package net.unicon.shibui.pac4j;

import org.pac4j.saml.util.ConfigurationManager;

import javax.annotation.Priority;

@Priority(1)
public class Pac4jSAMLConfigurationManager implements ConfigurationManager {
    @Override
    public void configure() {
        // do nothing. we already configuration opensaml elsewhere
    }
}
