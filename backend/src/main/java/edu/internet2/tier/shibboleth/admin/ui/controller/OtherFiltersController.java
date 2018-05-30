package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/MetadataResolver/{metadataResolverId}")
public class OtherFiltersController {

    private static Logger LOGGER = LoggerFactory.getLogger(EntityAttributesFilterController.class);

    @Autowired
    private MetadataResolverRepository repository;

    @Autowired
    private FilterService filterService;

    @Autowired
    private MetadataResolverService metadataResolverService;

    @GetMapping("/OtherFilters")
    @Transactional(readOnly = true)
    public Iterable<MetadataFilter> getAll(@PathVariable String metadataResolverId) {
        // TODO: implement lookup based on metadataResolverId once we have more than one
        return repository.findAll().iterator().next().getMetadataFilters();
    }
}
