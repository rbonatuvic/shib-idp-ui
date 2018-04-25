package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation;
import org.opensaml.saml.saml2.core.Attribute;

import java.util.List;

/**
 * facade API that defines operations for creating various entities from JSON representations
 */
public interface EntityService {
    List<Attribute> getAttributeListFromEntityRepresentation(EntityDescriptorRepresentation entityDescriptorRepresentation);
    List<Attribute> getAttributeListFromAttributeReleaseList(List<String> attributeReleaseList);
    List<Attribute> getAttributeListFromRelyingPartyOverridesRepresentation(RelyingPartyOverridesRepresentation relyingPartyOverridesRepresentation);
}
