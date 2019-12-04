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

    private Float refreshDelayFactor;

    private String minCacheDuration;

    private String maxCacheDuration;

    private String maxIdleEntityData;

    private Boolean removeIdleEntityData;

    private String cleanupTaskInterval;

    private String persistentCacheManagerRef;

    private String persistentCacheManagerDirectory;

    private String persistentCacheKeyGeneratorRef;

    private Boolean initializeFromPersistentCacheInBackground = true;

    private String backgroundInitializationFromCacheDelay;

    private String initializationFromCachePredicateRef;

}
