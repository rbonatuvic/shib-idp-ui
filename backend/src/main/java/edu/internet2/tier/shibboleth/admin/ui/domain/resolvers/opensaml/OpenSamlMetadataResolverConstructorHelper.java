package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.AbstractDynamicMetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.AbstractReloadingMetadataResolver;

import static edu.internet2.tier.shibboleth.admin.util.DurationUtility.toMillis;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlMetadataResolverConstructorHelper {

    public static void updateOpenSamlMetadataResolverFromDynamicMetadataResolverAttributes(MetadataResolver metadataResolver,
                                                                                           DynamicMetadataResolverAttributes attributes,
                                                                                           ParserPool parserPool) {
        AbstractDynamicMetadataResolver dynamicMetadataResolver = (AbstractDynamicMetadataResolver) metadataResolver;

        if (attributes.getBackgroundInitializationFromCacheDelay() != null) {
            dynamicMetadataResolver.setBackgroundInitializationFromCacheDelay(toMillis(attributes.getBackgroundInitializationFromCacheDelay()));
        }

        if (attributes.getCleanupTaskInterval() != null) {
            dynamicMetadataResolver.setCleanupTaskInterval(toMillis(attributes.getCleanupTaskInterval()));
        }

        if (attributes.getInitializeFromPersistentCacheInBackground()) {
            dynamicMetadataResolver.setInitializeFromPersistentCacheInBackground(attributes.getInitializeFromPersistentCacheInBackground());
        }

        if (attributes.getMaxCacheDuration() != null) {
            dynamicMetadataResolver.setMaxCacheDuration(toMillis(attributes.getMaxCacheDuration()));
        }

        if (attributes.getMaxIdleEntityData() != null) {
            dynamicMetadataResolver.setMaxIdleEntityData(toMillis(attributes.getMaxIdleEntityData()));
        }

        if (attributes.getMinCacheDuration() != null) {
            dynamicMetadataResolver.setMinCacheDuration(toMillis(attributes.getMinCacheDuration()));
        }

        if (attributes.getBackgroundInitializationFromCacheDelay() != null) {
            dynamicMetadataResolver.setBackgroundInitializationFromCacheDelay(toMillis(attributes.getBackgroundInitializationFromCacheDelay()));
        }

        if (attributes.getRefreshDelayFactor() != null) {
            dynamicMetadataResolver.setRefreshDelayFactor(attributes.getRefreshDelayFactor().floatValue());
        }

        if (attributes.getRemoveIdleEntityData() != null) {
            dynamicMetadataResolver.setRemoveIdleEntityData(attributes.getRemoveIdleEntityData());
        }

        //TODO: This takes a XMLObjectLoadSaveManager. Do we have what we need to create one?
        // dynamicMetadataResolver.setPersistentCacheManager(); attributes.getPersistentCacheManagerDirectory();
        // attributes.getPersistentCacheManagerRef();

        //TODO: This takes a Function. We've got a ref. How to convert?
        // dynamicMetadataResolver.setPersistentCacheKeyGenerator(); attributes.getPersistentCacheKeyGeneratorRef();

        //TODO: This takes a Predicate. We've got a predicate ref. How to convert?
        // dynamicMetadataResolver.setInitializationFromCachePredicate(); attributes.getInitializationFromCachePredicateRef();

        //TODO: This takes a ParserPool. We've got a ParserPoolRef in attributes.getParserPoolRef(). Should we use it for anything?
        dynamicMetadataResolver.setParserPool(parserPool);

        //TODO: Where does this get used in OpenSAML land?
        // attributes.getTaskTimerRef();
    }

    public static void updateOpenSamlMetadataResolverFromHttpMetadataResolverAttributes(MetadataResolver metadataResolver, HttpMetadataResolverAttributes attributes) {
        //TODO: Implement once we figure out what needs to happen here.
    }

    public static void updateOpenSamlMetadataResolverFromReloadableMetadataResolverAttributes(MetadataResolver metadataResolver,
                                                                                              ReloadableMetadataResolverAttributes attributes,
                                                                                              ParserPool parserPool) {
        AbstractReloadingMetadataResolver reloadingMetadataResolver = (AbstractReloadingMetadataResolver) metadataResolver;

        if (attributes.getExpirationWarningThreshold() != null) {
            reloadingMetadataResolver.setExpirationWarningThreshold(toMillis(attributes.getExpirationWarningThreshold()));
        }
        if (attributes.getMaxRefreshDelay() != null) {
            reloadingMetadataResolver.setMaxRefreshDelay(toMillis(attributes.getMaxRefreshDelay()));
        }
        if (attributes.getMinRefreshDelay() != null) {
            reloadingMetadataResolver.setMinRefreshDelay(toMillis(attributes.getMinRefreshDelay()));
        }

        if (attributes.getResolveViaPredicatesOnly() != null) {
            reloadingMetadataResolver.setResolveViaPredicatesOnly(attributes.getResolveViaPredicatesOnly());
        }

        if (attributes.getRefreshDelayFactor() != null) {
            reloadingMetadataResolver.setRefreshDelayFactor(attributes.getRefreshDelayFactor().floatValue());
        }

        //TODO: This takes a set of MetadataIndex's. We've got an IndexesRef. How to convert?
        // reloadingMetadataResolver.setIndexes(); attributes.getIndexesRef();

        //TODO: This takes a ParserPool. We've got a ParserPoolRef in attributes.getParserPoolRef(). Should we use it for anything?
        reloadingMetadataResolver.setParserPool(parserPool);

        //TODO: Where does this get used in OpenSAML land?
        // attributes.getTaskTimerRef();
    }
}
