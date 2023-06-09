package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverConverterService;
import edu.internet2.tier.shibboleth.admin.util.TokenPlaceholderResolvers;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * this is a temporary class until a better way of doing this is found.
 */
@Configuration
public class MetadataResolverConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(MetadataResolverConfiguration.class);

    @Autowired
    OpenSamlObjects openSamlObjects;

    @Autowired
    IndexWriterService indexWriterService;

    @Autowired
    MetadataResolverRepository metadataResolverRepository;

    @Autowired
    MetadataResolverConverterService metadataResolverConverterService;

    @Bean
    @Transactional
    //This injected dependency makes sure that this bean has been created and the wrapped placeholder resolver service
    //is available via static facade accessor method to all the downstream non-Spring managed consumers
    public MetadataResolver metadataResolver(TokenPlaceholderResolvers tokenPlaceholderResolvers, Optional<Set<edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver>> metadataResolvers) throws ResolverException, ComponentInitializationException {
        ChainingMetadataResolver metadataResolver = new OpenSamlChainingMetadataResolver();
        metadataResolver.setId("chain");

        List<MetadataResolver> resolvers = new ArrayList<>();

        Iterable<edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver> persistedResolvers = metadataResolverRepository.findAll();
        for (edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver resolver : persistedResolvers) {
            try {
                MetadataResolver openSamlResolver = metadataResolverConverterService.convertToOpenSamlRepresentation(resolver);
                resolvers.add(openSamlResolver);
            } catch (IOException e) {
                //TODO: do something interesting here?
            }
        }

        metadataResolver.setResolvers(resolvers);
        metadataResolver.initialize();
        return metadataResolver;
    }
}