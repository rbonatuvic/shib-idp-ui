package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static com.google.common.collect.FluentIterable.from;
import static java.util.stream.Collectors.toList;


/**
 * Default implementation of {@link MetadataResolversPositionOrderContainer}.
 *
 * @author Dmitriy Kopylenko
 */
public class DefaultMetadataResolversPositionOrderContainerService implements MetadataResolversPositionOrderContainerService {

    private MetadataResolversPositionOrderContainerRepository positionOrderContainerRepository;

    private MetadataResolverRepository metadataResolverRepository;

    public DefaultMetadataResolversPositionOrderContainerService(MetadataResolversPositionOrderContainerRepository positionOrderRepository,
                                                                 MetadataResolverRepository metadataResolverRepository) {
        this.positionOrderContainerRepository = positionOrderRepository;
        this.metadataResolverRepository = metadataResolverRepository;
    }

    @Override
    @Transactional
    public void addOrUpdatePositionOrderContainer(MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer) {
        MetadataResolversPositionOrderContainer existingPositionOrder = positionOrderContainerRepository.findAll().iterator().next();
        if (existingPositionOrder != null) {
            existingPositionOrder.setResourceIds(metadataResolversPositionOrderContainer.getResourceIds());
            positionOrderContainerRepository.save(existingPositionOrder);
            return;
        }
        positionOrderContainerRepository.save(metadataResolversPositionOrderContainer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MetadataResolver> getAllMetadataResolversInDefinedOrderOrUnordered() {
        Optional<MetadataResolversPositionOrderContainer> orderContainer = getPositionOrderContainerIfExists();
        if(orderContainer.isPresent()) {
            return orderContainer.get().getResourceIds()
                    .stream()
                    .map(metadataResolverRepository::findByResourceId)
                    .collect(toList());
        }

        return from(metadataResolverRepository.findAll()).toList();
    }

    private Optional<MetadataResolversPositionOrderContainer> getPositionOrderContainerIfExists() {
        return positionOrderContainerRepository.findAll().iterator().hasNext()
                ? Optional.of(positionOrderContainerRepository.findAll().iterator().next())
                : Optional.empty();
    }
}
