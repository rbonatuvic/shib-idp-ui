package net.unicon.shibui.pac4j;

import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.credentials.Credentials;
import org.pac4j.core.credentials.TokenCredentials;
import org.pac4j.core.credentials.authenticator.Authenticator;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.core.profile.definition.CommonProfileDefinition;
import org.pac4j.http.client.direct.ParameterClient;
import org.pac4j.saml.client.SAML2Client;
import org.pac4j.saml.client.SAML2ClientConfiguration;
import org.pac4j.saml.credentials.authenticator.SAML2Authenticator;
import org.pac4j.http.client.direct.HeaderClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
public class Pac4jConfiguration {
    @Bean
    public SAML2ModelAuthorizationGenerator saml2ModelAuthorizationGenerator(UserRepository userRepository) {
        return new SAML2ModelAuthorizationGenerator(userRepository);
    }

    @Bean
    public Config config(final Pac4jConfigurationProperties pac4jConfigurationProperties, final SAML2ModelAuthorizationGenerator saml2ModelAuthorizationGenerator) {

        final Clients clients = new Clients(pac4jConfigurationProperties.getCallbackUrl());

        if(pac4jConfigurationProperties.getTypeOfAuth().equals("SAML2")) { //f
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
            saml2ClientConfiguration.setAttributeAsId(pac4jConfigurationProperties.getSaml2ProfileMapping().getUsername());

            final SAML2Client saml2Client = new SAML2Client(saml2ClientConfiguration);
            saml2Client.setName("Saml2Client");
            saml2Client.addAuthorizationGenerator(saml2ModelAuthorizationGenerator);
            SAML2Authenticator saml2Authenticator = new SAML2Authenticator(saml2ClientConfiguration.getAttributeAsId(), saml2ClientConfiguration.getMappedAttributes());
            saml2Authenticator.setProfileDefinition(new CommonProfileDefinition<>(p -> new BetterSAML2Profile(pac4jConfigurationProperties.getSaml2ProfileMapping().getUsername())));
            saml2Client.setAuthenticator(saml2Authenticator);

            clients.setClients(saml2Client);
        }
        else if (pac4jConfigurationProperties.getTypeOfAuth().equals("HEADER")) {
              HeaderClient headerClient = new HeaderClient(pac4jConfigurationProperties.getAuthenticationHeader(), new Authenticator() {
                @Override
                public void validate(Credentials credentials, WebContext context) {

                }
            });
            clients.setClients(headerClient);
        }

        final Config config = new Config(clients);
        return config;
    }
}
