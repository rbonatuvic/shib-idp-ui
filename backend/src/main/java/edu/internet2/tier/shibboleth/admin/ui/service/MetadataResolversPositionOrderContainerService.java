package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;

import java.util.List;

/**
 * Service interface for manipulation of instances of {@link MetadataResolversPositionOrderContainer} and
 * to abstract away  MetadataResolvers ordering logic.
 *
 * @author Dmitriy Kopylenko
 */
public interface MetadataResolversPositionOrderContainerService {

    MetadataResolversPositionOrderContainer retrieveExistingOrEmpty();

    void addOrUpdatePositionOrderContainer(MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer);

    List<MetadataResolver> getAllMetadataResolversInDefinedOrderOrUnordered();

    void appendPositionOrderForNew(MetadataResolver metadataResolver);
}
