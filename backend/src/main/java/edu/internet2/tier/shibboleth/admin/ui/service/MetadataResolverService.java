package edu.internet2.tier.shibboleth.admin.ui.service;

import org.w3c.dom.Document;

import edu.internet2.tier.shibboleth.admin.ui.domain.exceptions.MetadataFileNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InitializationException;

public interface MetadataResolverService {
    public MetadataResolver findByResourceId(String resourceId) throws EntityNotFoundException;

    public Document generateConfiguration();

    public void reloadFilters(String metadataResolverName);

    public MetadataResolver updateMetadataResolverEnabledStatus(MetadataResolver existingResolver) throws ForbiddenException, MetadataFileNotFoundException, InitializationException;
}
