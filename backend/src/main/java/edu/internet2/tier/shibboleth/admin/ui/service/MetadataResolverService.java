package edu.internet2.tier.shibboleth.admin.ui.service;

import org.w3c.dom.Document;

public interface MetadataResolverService {
    public void reloadFilters(String metadataResolverName);

    public Document generateConfiguration();
}
