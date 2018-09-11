package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

/**
 * An SPI to resolve and convert data for different types of {@link MetadataResolver}s from possible provided '%{}' placeholders
 * <p>
 * Typical usage is - multiple replacers for concrete type of resolvers are configured in Spring Application Context,
 * aggregated by {@link MetadataResolverPropertyPlaceholderValuesResolvingService} facade and then that facade is injected into upstream consumers of it
 * such as REST controllers, etc.
 *
 * @author Dmitriy Kopylenko
 */
public interface MetadataResolverPropertyPlaceholderValuesReplacer<T extends MetadataResolver> {

    boolean supports(T metadataResolver);

    void replacePlaceholderValuesIfResolvableOrFail(T metadataResolver);
}
