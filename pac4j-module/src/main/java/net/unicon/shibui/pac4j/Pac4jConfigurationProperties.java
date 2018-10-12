package net.unicon.shibui.pac4j;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "shibui.pac4j")
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

    public String getKeystorePath() {
        return keystorePath;
    }

    public void setKeystorePath(String keystorePath) {
        this.keystorePath = keystorePath;
    }

    public String getKeystorePassword() {
        return keystorePassword;
    }

    public void setKeystorePassword(String keystorePassword) {
        this.keystorePassword = keystorePassword;
    }

    public String getPrivateKeyPassword() {
        return privateKeyPassword;
    }

    public void setPrivateKeyPassword(String privateKeyPassword) {
        this.privateKeyPassword = privateKeyPassword;
    }

    public String getIdentityProviderMetadataPath() {
        return identityProviderMetadataPath;
    }

    public void setIdentityProviderMetadataPath(String identityProviderMetadataPath) {
        this.identityProviderMetadataPath = identityProviderMetadataPath;
    }

    public int getMaximumAuthenticationLifetime() {
        return maximumAuthenticationLifetime;
    }

    public void setMaximumAuthenticationLifetime(int maximumAuthenticationLifetime) {
        this.maximumAuthenticationLifetime = maximumAuthenticationLifetime;
    }

    public String getServiceProviderEntityId() {
        return serviceProviderEntityId;
    }

    public void setServiceProviderEntityId(String serviceProviderEntityId) {
        this.serviceProviderEntityId = serviceProviderEntityId;
    }

    public String getServiceProviderMetadataPath() {
        return serviceProviderMetadataPath;
    }

    public void setServiceProviderMetadataPath(String serviceProviderMetadataPath) {
        this.serviceProviderMetadataPath = serviceProviderMetadataPath;
    }

    public boolean isForceServiceProviderMetadataGeneration() {
        return forceServiceProviderMetadataGeneration;
    }

    public void setForceServiceProviderMetadataGeneration(boolean forceServiceProviderMetadataGeneration) {
        this.forceServiceProviderMetadataGeneration = forceServiceProviderMetadataGeneration;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public boolean isWantAssertionsSigned() {
        return wantAssertionsSigned;
    }

    public void setWantAssertionsSigned(boolean wantAssertionsSigned) {
        this.wantAssertionsSigned = wantAssertionsSigned;
    }
}
