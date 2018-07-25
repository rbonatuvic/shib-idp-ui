package edu.internet2.tier.shibboleth.admin.ui.service;

import com.google.common.collect.Lists;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;


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
    public void persistPositionOrderContainer(MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer) {
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

        return Lists.newArrayList(metadataResolverRepository.findAll());
    }

    private Optional<MetadataResolversPositionOrderContainer> getPositionOrderContainerIfExists() {
        return positionOrderContainerRepository.findAll().iterator().hasNext()
                ? Optional.of(positionOrderContainerRepository.findAll().iterator().next())
                : Optional.empty();
    }
}
