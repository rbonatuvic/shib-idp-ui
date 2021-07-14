package net.unicon.shibui.pac4j;

import org.apache.commons.lang3.StringUtils;
import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.context.session.SessionStore;
import org.pac4j.core.credentials.Credentials;
import org.pac4j.core.credentials.TokenCredentials;
import org.pac4j.core.credentials.authenticator.Authenticator;
import org.pac4j.core.exception.CredentialsException;
import org.pac4j.core.matching.matcher.PathMatcher;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.core.profile.definition.CommonProfileDefinition;
import org.pac4j.http.client.direct.HeaderClient;
import org.pac4j.saml.client.SAML2Client;
import org.pac4j.saml.config.SAML2Configuration;
import org.pac4j.saml.credentials.authenticator.SAML2Authenticator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

import com.google.common.collect.Lists;

import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.extern.slf4j.Slf4j;

/**
 * Configuration setup here following readme from - https://github.com/pac4j/spring-security-pac4j/tree/5.0.x
 * NOTE: matchers are now done as part of the config and have been moved over from the WebSecurity.java class of this package
 * @see http://www.pac4j.org/docs/config.html
 */
@Configuration
@ConditionalOnProperty(name = "shibui.pac4j-enabled", havingValue = "true")
@Slf4j
public class Pac4jConfiguration {
    public final static String PAC4J_CLIENT_NAME = "shibUIAuthClient";
    
    @Autowired
    private UserService userService;
    
    /**
     * Custom class that ensures we add the user's roles to the information when doing SAML2 auth
     */
    @Bean
    public SAML2ModelAuthorizationGenerator saml2ModelAuthorizationGenerator(UserRepository userRepository) {
        return new SAML2ModelAuthorizationGenerator(userRepository);
    }
    
    @Bean(name = "pac4j-config")
    public Config config(final Pac4jConfigurationProperties pac4jConfigProps,
                         final SAML2ModelAuthorizationGenerator saml2ModelAuthorizationGenerator) {
        log.info("**** Configuring PAC4J ");
        final Config config = new Config();
        final Clients clients = new Clients(pac4jConfigProps.getCallbackUrl());
        
        // configure the matcher for bypassing auth checks
        PathMatcher pm = new PathMatcher();
        pm.setExcludedPaths(Lists.newArrayList("/favicon.ico", "/unsecured/**/*", "/assets/**/*.png", "/static/**/*"));
        config.addMatcher("exclude-paths-matcher", pm);

        // Configure the client
        switch (pac4jConfigProps.getTypeOfAuth()) {
        case "SAML2": {
            log.info("**** Configuring PAC4J SAML2");
            final SAML2Configuration saml2Config = new SAML2Configuration();
            saml2Config.setKeystorePath(pac4jConfigProps.getKeystorePath());
            saml2Config.setKeystorePassword(pac4jConfigProps.getKeystorePassword());
            saml2Config.setPrivateKeyPassword(pac4jConfigProps.getPrivateKeyPassword());
            saml2Config.setIdentityProviderMetadataPath(pac4jConfigProps.getIdentityProviderMetadataPath());
            saml2Config.setMaximumAuthenticationLifetime(pac4jConfigProps.getMaximumAuthenticationLifetime());
            saml2Config.setServiceProviderEntityId(pac4jConfigProps.getServiceProviderEntityId());
            saml2Config.setServiceProviderMetadataPath(pac4jConfigProps.getServiceProviderMetadataPath());
            saml2Config.setForceServiceProviderMetadataGeneration(pac4jConfigProps.isForceServiceProviderMetadataGeneration());
            saml2Config.setWantsAssertionsSigned(pac4jConfigProps.isWantAssertionsSigned());
            saml2Config.setAttributeAsId(pac4jConfigProps.getSaml2ProfileMapping().getUsername());
            //saml2Config.setPostLogoutURL(pac4jConfigProps.getPostLogoutURL()); // consideration needed?
            //saml2Config.setSpLogoutRequestBindingType(pac4jConfigProps.getSpLogoutRequestBindingType());

            final SAML2Client saml2Client = new SAML2Client(saml2Config);
            saml2Client.setName("Saml2Client");
            saml2Client.addAuthorizationGenerator(saml2ModelAuthorizationGenerator);
            SAML2Authenticator saml2Authenticator = new SAML2Authenticator(saml2Config.getAttributeAsId(), saml2Config.getMappedAttributes());
            saml2Authenticator.setProfileDefinition(new CommonProfileDefinition(p -> new BetterSAML2Profile(pac4jConfigProps.getSaml2ProfileMapping().getUsername())));
            saml2Client.setAuthenticator(saml2Authenticator);

            saml2Client.setName(PAC4J_CLIENT_NAME);
            clients.setClients(saml2Client);
        }
        case "HEADER": {
            log.info("**** Configuring PAC4J Header Client");
            HeaderClient headerClient = new HeaderClient(pac4jConfigProps.getAuthenticationHeader(),
                            new Authenticator() {
                                @Override
                                public void validate(Credentials credentials, WebContext context, SessionStore sessionStore) {
                                    if (credentials instanceof TokenCredentials) {
                                        TokenCredentials creds = (TokenCredentials) credentials;
                                        String token = creds.getToken();
                                        if (StringUtils.isAllBlank(token)) {
                                            throw new CredentialsException("Supplied token value in header was missing or blank");
                                        }
                                    } else {
                                        throw new CredentialsException("Invalid Credentials object generated by HeaderClient");
                                    }
                                    final CommonProfile profile = new CommonProfile();
                                    String token = ((TokenCredentials)credentials).getToken(); 
                                    profile.setId(token);
                                    profile.setRoles(userService.getUserRoles(token));
                                    credentials.setUserProfile(profile);
                                }
                            });
            headerClient.setName(PAC4J_CLIENT_NAME);
            clients.setClients(headerClient);
        }
        }       
        config.setClients(clients);
        return config;
    }
    
    @Bean
    public ErrorPageRegistrar errorPageRegistrar() {
        return this::registerErrorPages;
    }

    private void registerErrorPages(ErrorPageRegistry registry) {
        registry.addErrorPages(new ErrorPage(HttpStatus.UNAUTHORIZED, "/unsecured/error.html"));
        registry.addErrorPages(new ErrorPage(HttpStatus.FORBIDDEN, "/unsecured/error.html"));
    }
}
