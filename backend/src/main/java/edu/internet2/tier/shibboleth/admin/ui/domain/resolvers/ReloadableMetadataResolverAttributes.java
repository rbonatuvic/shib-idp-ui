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
public class ReloadableMetadataResolverAttributes {

    private String parserPoolRef;

    private String taskTimerRef;

    private String minRefreshDelay;

    private String maxRefreshDelay;

    private Double refreshDelayFactor;

    private String indexesRef;

    private Boolean resolveViaPredicatesOnly;

    private String expirationWarningThreshold;

}
