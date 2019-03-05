package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder;
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.RelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility;
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;
import org.opensaml.saml.saml2.core.Attribute;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = ((AttributeBuilder) openSamlObjects
                .getBuilderFactory()
                .getBuilder(edu.internet2.tier.shibboleth.admin.ui.domain.Attribute.DEFAULT_ELEMENT_NAME))
                .buildObject();

        attribute.setName(MDDCConstants.RELEASE_ATTRIBUTES);

        attributeReleaseList.forEach(attributeRelease -> {
            XSString xsString = (XSString) openSamlObjects
                    .getBuilderFactory()
                    .getBuilder(XSString.TYPE_NAME)
                    .buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSString.TYPE_NAME);
            xsString.setValue(attributeRelease);
            attribute.getAttributeValues().add(xsString);
        });

        return attribute;
    }

    @Override
    public List<Attribute> getAttributeListFromAttributeReleaseList(List<String> attributeReleaseList) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> attributeList = new ArrayList<>();

        if (attributeReleaseList != null && attributeReleaseList.size() > 0) {
            attributeList.add(attributeUtility.createAttributeWithStringValues(MDDCConstants.RELEASE_ATTRIBUTES, attributeReleaseList));
        }

        return (List<Attribute>)(List<? extends Attribute>)attributeList;
    }

    edu.internet2.tier.shibboleth.admin.ui.domain.Attribute getAttributeFromObjectAndRelyingPartyOverrideProperty(Object o, RelyingPartyOverrideProperty overrideProperty) {
        switch (ModelRepresentationConversions.AttributeTypes.valueOf(overrideProperty.getDisplayType().toUpperCase())) {
            case BOOLEAN:
                if ((o instanceof Boolean && ((Boolean)o)) ||
                        (o instanceof String) && Boolean.valueOf((String)o)) {
                    if (overrideProperty.getPersistType() != null &&
                            !overrideProperty.getPersistType().equalsIgnoreCase("boolean")) {
                        return attributeUtility.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                                overrideProperty.getAttributeFriendlyName(),
                                overrideProperty.getPersistValue());
                    } else {
                        if (o instanceof String) {
                            return attributeUtility.createAttributeWithBooleanValue(overrideProperty.getAttributeName(),
                                    overrideProperty.getAttributeFriendlyName(),
                                    Boolean.valueOf((String) o));
                        } else {
                            Boolean value = Boolean.valueOf(overrideProperty.getInvert()) ^ (Boolean)o;
                            return attributeUtility.createAttributeWithBooleanValue(overrideProperty.getAttributeName(),
                                    overrideProperty.getAttributeFriendlyName(),
                                    value);
                        }
                    }
                }
                return null;
            case INTEGER:
                return attributeUtility.createAttributeWithIntegerValue(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        Integer.valueOf((String) o));
            case STRING:
                return attributeUtility.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        (String) o);
            case SET:
                return attributeUtility.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        (List<String>) o);
            case LIST:
                return attributeUtility.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        (List<String>) o);
            default:
                throw new UnsupportedOperationException("getAttributeListFromRelyingPartyOverridesRepresentation was called with an unsupported type (" + overrideProperty.getDisplayType() + ")!");
        }
    }

    @Override
    public List<Attribute> getAttributeListFromRelyingPartyOverridesRepresentation(Map<String, Object> relyingPartyOverridesRepresentation) {
        List<RelyingPartyOverrideProperty> overridePropertyList = customPropertiesConfiguration.getOverrides();
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> list = new ArrayList<>();

        for (Map.Entry entry : relyingPartyOverridesRepresentation.entrySet()) {
            String key = (String) entry.getKey();
            RelyingPartyOverrideProperty overrideProperty = overridePropertyList.stream().filter(op -> op.getName().equals(key)).findFirst().get();
            edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = getAttributeFromObjectAndRelyingPartyOverrideProperty(entry.getValue(), overrideProperty);
            if (attribute != null) {
                list.add(attribute);
            }
        }

        return (List<org.opensaml.saml.saml2.core.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) list;
    }
}
