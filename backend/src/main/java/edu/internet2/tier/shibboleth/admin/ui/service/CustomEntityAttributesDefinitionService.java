package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;

import java.util.List;

public interface CustomEntityAttributesDefinitionService {

    CustomEntityAttributeDefinition createOrUpdateDefinition(CustomEntityAttributeDefinition definition);

    void deleteDefinition(CustomEntityAttributeDefinition definition);

    CustomEntityAttributeDefinition find(String resourceId);

    List<CustomEntityAttributeDefinition> getAllDefinitions();

}