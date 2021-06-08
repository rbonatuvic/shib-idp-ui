package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.List;

import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition;

public interface CustomEntityAttributesDefinitionService {

    void addCustomEntityAttributesDefinitionListener(ICustomEntityAttributesDefinitionListener listener);

    CustomEntityAttributeDefinition createOrUpdateDefinition(CustomEntityAttributeDefinition definition);

    void deleteDefinition(CustomEntityAttributeDefinition definition);

    CustomEntityAttributeDefinition find(String name);

    List<CustomEntityAttributeDefinition> getAllDefinitions();

}
