package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class DynamicMetadataResolverAttributes {

    private String parserPoolRef;

    private String taskTimerRef;

    private Double refreshDelayFactor = 0.75;

    private String minCacheDuration = "PT10M";

    private String maxCacheDuration = "PT8H";

    private String maxIdleEntityData = "PT8H";

    private Boolean removeIdleEntityData;

    private String cleanupTaskInterval = "PT30M";

    private String persistentCacheManagerRef;

    private String persistentCacheManagerDirectory;

    private String persistentCacheKeyGeneratorRef;

    private Boolean initializeFromPersistentCacheInBackground = true;

    private String backgroundInitializationFromCacheDelay = "PT2S";

    private String initializationFromCachePredicateRef;

}
