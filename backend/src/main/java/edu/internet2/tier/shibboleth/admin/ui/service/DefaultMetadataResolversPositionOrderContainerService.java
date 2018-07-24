package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;

import java.util.Optional;

public class DefaultMetadataResolversPositionOrderContainerService implements MetadataResolversPositionOrderContainerService {

    @Override
    public Optional<MetadataResolversPositionOrderContainer> getPositionOrderContainerIfExists() {
        return Optional.empty();
    }

    @Override
    public void persistPositionOrderContainer(MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer) {

    }
}
