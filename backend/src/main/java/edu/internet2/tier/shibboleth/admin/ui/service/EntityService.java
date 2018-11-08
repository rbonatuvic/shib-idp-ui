package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import org.opensaml.saml.saml2.core.Attribute;

import java.util.List;
import java.util.Map;

/**
 * facade API that defines operations for creating various entities from JSON representations
 */
public interface EntityService {
    List<Attribute> getAttributeListFromEntityRepresentation(EntityDescriptorRepresentation entityDescriptorRepresentation);
    edu.internet2.tier.shibboleth.admin.ui.domain.Attribute getAttributeFromAttributeReleaseList(List<String> attributeReleaseList);
    List<Attribute> getAttributeListFromAttributeReleaseList(List<String> attributeReleaseList);
    List<Attribute> getAttributeListFromRelyingPartyOverridesRepresentation(Map<String, Object> relyingPartyOverridesRepresentation);
}
