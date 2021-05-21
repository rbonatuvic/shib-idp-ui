package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomAttributeDefinition;

public interface CustomAttributesService {

    CustomAttributeDefinition createOrUpdateDefinition(CustomAttributeDefinition definition);

    void deleteDefinition(CustomAttributeDefinition definition);

    CustomAttributeDefinition find(String name);

    List<CustomAttributeDefinition> getAllDefinitions();

}
