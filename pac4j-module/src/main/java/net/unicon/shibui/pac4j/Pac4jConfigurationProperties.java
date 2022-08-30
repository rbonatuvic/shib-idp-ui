package net.unicon.shibui.pac4j;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "shibui.pac4j")
@EnableConfigurationProperties
@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
@Getter
@Setter
public class Pac4jConfigurationProperties {
    
    final static String DEFAULT_AUTH_HEADER = "REMOTE_USER";
    private String authenticationHeader = DEFAULT_AUTH_HEADER;
    private String callbackUrl;
    private boolean forceServiceProviderMetadataGeneration = false;
    private String identityProviderMetadataPath = "/tmp/idp-metadata.xml";
    private String keystorePassword = "changeit";
    private String keystorePath = "/tmp/samlKeystore.jks";
    private int maximumAuthenticationLifetime = 3600;
    private String privateKeyPassword = "changeit";
    private boolean requireAssertedRoleForNewUsers = false;
    private SimpleProfileMapping simpleProfileMapping;
    private String serviceProviderEntityId = "https://unicon.net/shibui";
    private String serviceProviderMetadataPath = "/tmp/sp-metadata.xml";
    private String typeOfAuth = "SAML2";
    private String postLogoutURL;

    private boolean wantAssertionsSigned = true;
    
    @Getter
    @Setter
    public static class SimpleProfileMapping {
        private String email;
        private String firstName;
        private String groups;
        private String roles;
        private String lastName;
        private String username;
    }
}