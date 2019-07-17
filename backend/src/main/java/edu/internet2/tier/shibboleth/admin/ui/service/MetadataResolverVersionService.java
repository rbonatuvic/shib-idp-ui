package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;

import java.util.List;

/**
 * API containing operations pertaining to {@link MetadataResolver} versioning.
 */
public interface MetadataResolverVersionService {

    List<Version> findVersionsForMetadataResolver(String resourceId);

    MetadataResolver findSpecificVersionOfMetadataResolver(String resourceId, String versionId);
}
