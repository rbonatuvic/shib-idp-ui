package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.metadata.resolver.impl.AbstractBatchMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlBatchMetadataResolverDelegate extends AbstractBatchMetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(OpenSamlBatchMetadataResolverDelegate.class);

    //TODO: Not sure this delegate is really buying us anything.. other than to get this one line in to a shared class.
    //Maybe we'll do more in here later?
    public void refilter(AbstractBatchMetadataResolver.BatchEntityBackingStore backingStore, XMLObject filteredMetadata) {
        backingStore.setCachedFilteredMetadata(filteredMetadata);
    }
}
