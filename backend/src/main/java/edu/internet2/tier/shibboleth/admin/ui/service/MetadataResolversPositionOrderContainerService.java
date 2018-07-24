package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;

import java.util.Optional;

/**
 * Service interface for manipulation of instances of {@link MetadataResolversPositionOrderContainer}.
 *
 * @author Dmitriy Kopylenko
 */
public interface MetadataResolversPositionOrderContainerService {

    Optional<MetadataResolversPositionOrderContainer> getPositionOrderContainerIfExists();

    void persistPositionOrderContainer(MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer);
}
