package net.unicon.shibui.pac4j;

import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.saml.client.SAML2Client;
import org.pac4j.saml.client.SAML2ClientConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Pac4jConfiguration {
    @Bean
    public Config config(final Pac4jConfigurationProperties pac4jConfigurationProperties) {
        final SAML2ClientConfiguration saml2ClientConfiguration = new SAML2ClientConfiguration();
        saml2ClientConfiguration.setKeystorePath(pac4jConfigurationProperties.getKeystorePath());
        saml2ClientConfiguration.setKeystorePassword(pac4jConfigurationProperties.getKeystorePassword());
        saml2ClientConfiguration.setPrivateKeyPassword(pac4jConfigurationProperties.getPrivateKeyPassword());
        saml2ClientConfiguration.setIdentityProviderMetadataPath(pac4jConfigurationProperties.getIdentityProviderMetadataPath());
        saml2ClientConfiguration.setMaximumAuthenticationLifetime(pac4jConfigurationProperties.getMaximumAuthenticationLifetime());
        saml2ClientConfiguration.setServiceProviderEntityId(pac4jConfigurationProperties.getServiceProviderEntityId());
        saml2ClientConfiguration.setServiceProviderMetadataPath(pac4jConfigurationProperties.getServiceProviderMetadataPath());
        saml2ClientConfiguration.setForceServiceProviderMetadataGeneration(pac4jConfigurationProperties.isForceServiceProviderMetadataGeneration());
        saml2ClientConfiguration.setWantsAssertionsSigned(pac4jConfigurationProperties.isWantAssertionsSigned());

        final SAML2Client saml2Client = new SAML2Client(saml2ClientConfiguration);
        saml2Client.setName("Saml2Client");

        final Clients clients = new Clients(pac4jConfigurationProperties.getCallbackUrl(), saml2Client);

        final Config config = new Config(clients);
        return config;
    }
}
