package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.Pac4jConstants;
import org.pac4j.core.profile.definition.CommonProfileDefinition;
import org.pac4j.saml.client.SAML2Client;
import org.pac4j.saml.client.SAML2ClientConfiguration;
import org.pac4j.saml.credentials.authenticator.SAML2Authenticator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class Pac4jConfiguration {
    @Bean
    public SAML2ModelAuthorizationGenerator saml2ModelAuthorizationGenerator(UserRepository userRepository) {
        return new SAML2ModelAuthorizationGenerator(userRepository);
    }

    @Bean
    public Config config(final Pac4jConfigurationProperties pac4jConfigurationProperties, final SAML2ModelAuthorizationGenerator saml2ModelAuthorizationGenerator) {
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
        // TODO: make not hardcoded
        saml2ClientConfiguration.setAttributeAsId("email");
        Map<String, String> mappedAttributes = new HashMap<>();
        // TODO: make not hardcoded
        mappedAttributes.put("email", Pac4jConstants.USERNAME);
        saml2ClientConfiguration.setMappedAttributes(mappedAttributes);

        final SAML2Client saml2Client = new SAML2Client(saml2ClientConfiguration);
        saml2Client.setName("Saml2Client");
        saml2Client.addAuthorizationGenerator(saml2ModelAuthorizationGenerator);

        final Clients clients = new Clients(pac4jConfigurationProperties.getCallbackUrl(), saml2Client);

        final Config config = new Config(clients);
        return config;
    }
}
