package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.AbstractDynamicMetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.AbstractReloadingMetadataResolver;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlMetadataResolverConstructorHelper {

    public static void updateOpenSamlMetadataResolverFromDynamicMetadataResolverAttributes(MetadataResolver metadataResolver, DynamicMetadataResolverAttributes attributes) {

        AbstractDynamicMetadataResolver dynamicMetadataResolver = (AbstractDynamicMetadataResolver) metadataResolver;

        // from DynamicMetadataResolverAttributes
        dynamicMetadataResolver.setBackgroundInitializationFromCacheDelay(Long.valueOf(attributes.getBackgroundInitializationFromCacheDelay()));
        dynamicMetadataResolver.setCleanupTaskInterval(Long.valueOf(attributes.getCleanupTaskInterval()));
        dynamicMetadataResolver.setInitializeFromPersistentCacheInBackground(attributes.getInitializeFromPersistentCacheInBackground());
        dynamicMetadataResolver.setMaxCacheDuration(Long.valueOf(attributes.getMaxCacheDuration()));
        dynamicMetadataResolver.setMaxIdleEntityData(Long.valueOf(attributes.getMaxIdleEntityData()));
        dynamicMetadataResolver.setMinCacheDuration(Long.valueOf(attributes.getMinCacheDuration()));
        dynamicMetadataResolver.setBackgroundInitializationFromCacheDelay(Long.valueOf(attributes.getBackgroundInitializationFromCacheDelay()));
        dynamicMetadataResolver.setRefreshDelayFactor(attributes.getRefreshDelayFactor().floatValue());
        dynamicMetadataResolver.setRemoveIdleEntityData(attributes.getRemoveIdleEntityData());

        //TODO: This takes a XMLObjectLoadSaveManager. Do we have what we need to create one?
        // dynamicMetadataResolver.setPersistentCacheManager(); attributes.getPersistentCacheManagerDirectory();
        // attributes.getPersistentCacheManagerRef();

        //TODO: This takes a Function. We've got a ref. How to convert?
        // dynamicMetadataResolver.setPersistentCacheKeyGenerator(); attributes.getPersistentCacheKeyGeneratorRef();

        //TODO: This takes a Predicate. We've got a predicate ref. How to convert?
        // dynamicMetadataResolver.setInitializationFromCachePredicate(); attributes.getInitializationFromCachePredicateRef();

        //TODO: This takes a ParserPool. We've got a ParserPoolRef. How to convert?
        // dynamicMetadataResolver.setParserPool(); attributes.getParserPoolRef();

        //TODO: Where does this get used in OpenSAML land?
        // attributes.getTaskTimerRef();
    }

    public static void updateOpenSamlMetadataResolverFromHttpMetadataResolverAttributes(MetadataResolver metadataResolver, HttpMetadataResolverAttributes attributes) {
        //TODO: Implement once we figure out what needs to happen here.
    }

    public static void updateOpenSamlMetadataResolverFromReloadableMetadataResolverAttributes(MetadataResolver metadataResolver, ReloadableMetadataResolverAttributes attributes) {
        AbstractReloadingMetadataResolver reloadingMetadataResolver = (AbstractReloadingMetadataResolver) metadataResolver;

        reloadingMetadataResolver.setExpirationWarningThreshold(Long.parseLong(attributes.getExpirationWarningThreshold()));
        reloadingMetadataResolver.setMaxRefreshDelay(Long.parseLong(attributes.getMaxRefreshDelay()));
        reloadingMetadataResolver.setMinRefreshDelay(Long.parseLong(attributes.getMinRefreshDelay()));
        reloadingMetadataResolver.setRefreshDelayFactor(attributes.getRefreshDelayFactor().floatValue());
        reloadingMetadataResolver.setResolveViaPredicatesOnly(attributes.getResolveViaPredicatesOnly());

        //TODO: This takes a set of MetadataIndex's. We've got an IndexesRef. How to convert?
        // reloadingMetadataResolver.setIndexes(); attributes.getIndexesRef();

        //TODO: This takes a ParserPool. We've got a ParserPoolRef. How to convert?
        // reloadingMetadataResolver.setParserPool(); attributes.getParserPoolRef();

        //TODO: Where does this get used in OpenSAML land?
        // attributes.getTaskTimerRef();
    }
}
