package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;

import java.util.List;

/**
 * Service interface for manipulation of instances of {@link MetadataResolversPositionOrderContainer} and
 * encapsulate MetadataResolvers ordering logic.
 *
 * @author Dmitriy Kopylenko
 */
public interface MetadataResolversPositionOrderContainerService {

    void persistPositionOrderContainer(MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer);

    List<MetadataResolver> getAllMetadataResolversInDefinedOrderOrUnordered();


}
