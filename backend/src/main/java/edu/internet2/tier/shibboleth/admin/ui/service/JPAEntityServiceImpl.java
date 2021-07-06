package edu.internet2.tier.shibboleth.admin.ui.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.opensaml.saml.saml2.core.Attribute;
import org.springframework.beans.factory.annotation.Autowired;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;

public class JPAEntityServiceImpl implements EntityService {

    @Autowired
    private OpenSamlObjects openSamlObjects;

    @Autowired
    private AttributeUtility attributeUtility;

    @Autowired
    private CustomPropertiesConfiguration customPropertiesConfiguration;

    public JPAEntityServiceImpl(OpenSamlObjects openSamlObjects) {
        this.openSamlObjects = openSamlObjects;
    }

    public JPAEntityServiceImpl(OpenSamlObjects openSamlObjects, AttributeUtility attributeUtility) {
        this.openSamlObjects = openSamlObjects;
        this.attributeUtility = attributeUtility;
    }

    public JPAEntityServiceImpl(OpenSamlObjects openSamlObjects,
                                AttributeUtility attributeUtility,
                                CustomPropertiesConfiguration customPropertiesConfiguration) {
        this.openSamlObjects = openSamlObjects;
        this.attributeUtility = attributeUtility;
        this.customPropertiesConfiguration = customPropertiesConfiguration;
    }

    @Override
    public List<Attribute> getAttributeListFromEntityRepresentation(EntityDescriptorRepresentation entityDescriptorRepresentation) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> list = new ArrayList<>();
        if (entityDescriptorRepresentation.getRelyingPartyOverrides() != null) {
            getAttributeListFromRelyingPartyOverridesRepresentation(entityDescriptorRepresentation.getRelyingPartyOverrides()).forEach(attribute ->
                list.add((edu.internet2.tier.shibboleth.admin.ui.domain.Attribute) attribute)
            );
        }

        // let's map the attribute release
        if (entityDescriptorRepresentation.getAttributeRelease() != null && entityDescriptorRepresentation.getAttributeRelease().size() > 0) {
            list.add(getAttributeFromAttributeReleaseList(entityDescriptorRepresentation.getAttributeRelease()));
        }

        return (List<Attribute>)(List<? extends Attribute>)list;
    }

    @Override
    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute getAttributeFromAttributeReleaseList(List<String> attributeReleaseList) {
        return (edu.internet2.tier.shibboleth.admin.ui.domain.Attribute) ModelRepresentationConversions.getAttributeListFromAttributeReleaseList(attributeReleaseList).get(0);
    }

    @Override
    public List<Attribute> getAttributeListFromAttributeReleaseList(List<String> attributeReleaseList) {
        return ModelRepresentationConversions.getAttributeListFromAttributeReleaseList(attributeReleaseList);
    }

    @Override
    public List<Attribute> getAttributeListFromRelyingPartyOverridesRepresentation(Map<String, Object> relyingPartyOverridesRepresentation) {
        return ModelRepresentationConversions.getAttributeListFromRelyingPartyOverridesRepresentation(relyingPartyOverridesRepresentation);
    }
}
