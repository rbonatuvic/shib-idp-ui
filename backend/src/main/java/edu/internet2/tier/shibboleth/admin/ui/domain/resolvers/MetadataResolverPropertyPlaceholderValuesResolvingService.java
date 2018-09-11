package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import java.util.ArrayList;
import java.util.List;

/**
 * A facade that aggregates {@link MetadataResolverPropertyPlaceholderValuesReplacer}s available to call just one of them supporting the type of a given resolver.
 * If no {@link MetadataResolverPropertyPlaceholderValuesReplacer}s are configured, considers a noop.
 *
 * Uses chain-of-responsibility design pattern
 *
 * @author Dmitriy Kopylenko
 */
public class MetadataResolverPropertyPlaceholderValuesResolvingService<T extends MetadataResolver> {

    private List<MetadataResolverPropertyPlaceholderValuesReplacer<T>> replacers;

    public MetadataResolverPropertyPlaceholderValuesResolvingService(List<MetadataResolverPropertyPlaceholderValuesReplacer<T>> replacers) {
        this.replacers = replacers != null ? replacers : new ArrayList<>();
    }

    public void replacePlacehoderValuesOrFail(T metadataResolver) {
        this.replacers
                .stream()
                .filter(r -> r.supports(metadataResolver))
                .findFirst()
                .ifPresent(r -> r.replacePlaceholderValuesIfResolvableOrFail(metadataResolver));
    }
}
