package net.unicon.shibui.pac4j;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "shibui.pac4j")
@Getter
@Setter
public class Pac4jConfigurationProperties {
    private String keystorePath = "/tmp/samlKeystore.jks";
    private String keystorePassword = "changeit";
    private String privateKeyPassword = "changeit";
    private String identityProviderMetadataPath = "/tmp/idp-metadata.xml";
    private int maximumAuthenticationLifetime = 3600;
    private String serviceProviderEntityId = "https://unicon.net/shibui";
    private String serviceProviderMetadataPath = "/tmp/sp-metadata.xml";
    private boolean forceServiceProviderMetadataGeneration = false;
    private String callbackUrl;
    private boolean wantAssertionsSigned = true;
}
