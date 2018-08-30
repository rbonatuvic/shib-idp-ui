package edu.internet2.tier.shibboleth.admin.ui.service;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.opensaml.saml.metadata.resolver.MetadataResolver;

import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public interface MetadataResolverConverterService {
    MetadataResolver convertToOpenSamlRepresentation(edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver resolver) throws IOException, ResolverException, ComponentInitializationException;
}
