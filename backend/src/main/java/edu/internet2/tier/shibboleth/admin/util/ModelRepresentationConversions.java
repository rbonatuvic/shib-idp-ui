package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.IRelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSAny;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSInteger;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import org.opensaml.core.xml.XMLObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Utility class to deal with model conversions related functionality
 */
public class ModelRepresentationConversions {

    private static final AttributeUtility ATTRIBUTE_UTILITY;

    private static CustomPropertiesConfiguration customPropertiesConfiguration;

    @Autowired
    public ModelRepresentationConversions(CustomPropertiesConfiguration customPropertiesConfiguration) {
        ModelRepresentationConversions.customPropertiesConfiguration = customPropertiesConfiguration;
    }

    static {
        OpenSamlObjects openSamlObjects = new OpenSamlObjects();
        try {
            openSamlObjects.init();
        } catch (ComponentInitializationException e) {
            throw new IllegalStateException(e);
        }
        ATTRIBUTE_UTILITY = new AttributeUtility(openSamlObjects);

    }

    public static List<String> getStringListOfAttributeValues(List<XMLObject> attributeValues) {
        List<String> stringAttributeValues = new ArrayList<>();
        for (XMLObject attributeValue : attributeValues) {
            if (attributeValue instanceof org.opensaml.core.xml.schema.XSString) {
                stringAttributeValues.add(((org.opensaml.core.xml.schema.XSString) attributeValue).getValue());
            } else if (attributeValue instanceof org.opensaml.core.xml.schema.XSAny) {
                stringAttributeValues.add(((org.opensaml.core.xml.schema.XSAny) attributeValue).getTextContent());
            }
        }
        return stringAttributeValues;
    }

    public static List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList) {
        List<Attribute> releaseAttributes = attributeList.stream()
                .filter(attribute -> attribute.getName().equals(MDDCConstants.RELEASE_ATTRIBUTES))
                .collect(Collectors.toList());

        List<String> attributeValues = new ArrayList<>();
        for (Attribute attribute : releaseAttributes) {
            attributeValues.addAll(getStringListOfAttributeValues(attribute.getAttributeValues()));
        }
        return attributeValues;
    }

    public static boolean getBooleanValueOfAttribute(Attribute attribute) {
        return ((XSBoolean) attribute.getAttributeValues().get(0)).getValue().getValue();
    }

    public static List<String> getStringListValueOfAttribute(Attribute attribute) {
        return getStringListOfAttributeValues(attribute.getAttributeValues());
    }

    public static Optional getOverrideByAttributeName(String attributeName) {
        return customPropertiesConfiguration.getOverrides().stream().filter(it -> it.getAttributeName().equals(attributeName)).findFirst();
    }

    public static Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList) {
        Map<String, Object> relyingPartyOverrides = new HashMap<>();

        for (org.opensaml.saml.saml2.core.Attribute attribute : attributeList) {
            Attribute jpaAttribute = (Attribute) attribute;

            Optional override = getOverrideByAttributeName(jpaAttribute.getName());
            if (override.isPresent()) {
                relyingPartyOverrides.put(((IRelyingPartyOverrideProperty) override.get()).getName(),
                        getOverrideFromAttribute(jpaAttribute));
            }
        }

        return relyingPartyOverrides;
    }

    public static Object getOverrideFromAttribute(Attribute attribute) {
        IRelyingPartyOverrideProperty relyingPartyOverrideProperty = customPropertiesConfiguration.getOverrides().stream()
                .filter(it -> it.getAttributeFriendlyName().equals(attribute.getFriendlyName())).findFirst().get();

        List<XMLObject> attributeValues = attribute.getAttributeValues();
        switch (AttributeTypes.valueOf(relyingPartyOverrideProperty.getDisplayType().toUpperCase())) {
            case BOOLEAN:
                if (relyingPartyOverrideProperty.getPersistType() != null
                        && (!relyingPartyOverrideProperty.getPersistType().equalsIgnoreCase("boolean"))) {
                    return relyingPartyOverrideProperty.getPersistValue().equals(getValueFromXMLObject(attributeValues.get(0)));
                } else {
                    return Boolean.valueOf(relyingPartyOverrideProperty.getInvert()) ^ Boolean.valueOf(((XSBoolean) attributeValues.get(0)).getStoredValue());
                }
            case INTEGER:            
                return ((XSInteger) attributeValues.get(0)).getValue();                
            case STRING:
            case LONG:
            case DOUBLE:
            case DURATION:
            case SPRING_BEAN_ID:
                if (attributeValues.get(0) instanceof XSAny) {
                    return ((XSAny) attributeValues.get(0)).getTextContent();
                } else {
                    return ((XSString) attributeValues.get(0)).getValue();
                }
            case SET:
            case LIST:
            case SELECTION_LIST:
                return attributeValues.stream().map(it -> ((XSString) it).getValue()).collect(Collectors.toList());
            default:
                throw new UnsupportedOperationException("An unsupported persist type was specified (" + relyingPartyOverrideProperty.getPersistType() + ")!");
        }
    }

    public static String getValueFromXMLObject(XMLObject xmlObject) {
        String objectType = xmlObject.getClass().getSimpleName();
        switch (objectType) {
            case "XSAny":
                return ((XSAny) xmlObject).getTextContent();
            case "XSString":
                return ((XSString) xmlObject).getValue();
            case "XSBoolean":
                return ((XSBoolean) xmlObject).getStoredValue();
            default:
                throw new RuntimeException(String.format("Unsupported XML Object type [%s]", objectType));
        }
    }

    public static List<org.opensaml.saml.saml2.core.Attribute> getAttributeListFromAttributeReleaseList(List<String> attributeReleaseList) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> attributeList = new ArrayList<>();

        if (attributeReleaseList != null && attributeReleaseList.size() > 0) {
            attributeList.add(ATTRIBUTE_UTILITY.createAttributeWithStringValues(MDDCConstants.RELEASE_ATTRIBUTES, attributeReleaseList));
        }

        return (List<org.opensaml.saml.saml2.core.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) attributeList;
    }

    public static List<org.opensaml.saml.saml2.core.Attribute> getAttributeListFromRelyingPartyOverridesRepresentation
            (Map<String, Object> relyingPartyOverridesRepresentation) {
        List<IRelyingPartyOverrideProperty> overridePropertyList = customPropertiesConfiguration.getOverrides();
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> list = new ArrayList<>();

        if (relyingPartyOverridesRepresentation != null) {
            for (Map.Entry entry : relyingPartyOverridesRepresentation.entrySet()) {
                String key = (String) entry.getKey();
                IRelyingPartyOverrideProperty overrideProperty = overridePropertyList.stream().filter(op -> op.getName().equals(key)).findFirst().get();
                Attribute attribute = getAttributeFromObjectAndRelyingPartyOverrideProperty(entry.getValue(), overrideProperty);
                if (attribute != null) {
                    list.add(attribute);
                }
            }
        }

        return (List<org.opensaml.saml.saml2.core.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) list;
    }

    public static Attribute getAttributeFromObjectAndRelyingPartyOverrideProperty(Object o, IRelyingPartyOverrideProperty overrideProperty) {
        switch (ModelRepresentationConversions.AttributeTypes.valueOf(overrideProperty.getDisplayType().toUpperCase())) {
            case BOOLEAN:
                if ((o instanceof Boolean && ((Boolean) o)) ||
                        (o instanceof String) && Boolean.valueOf((String) o)) {
                    if (overrideProperty.getPersistType() != null &&
                            !overrideProperty.getPersistType().equalsIgnoreCase("boolean")) {
                        return ATTRIBUTE_UTILITY.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                                overrideProperty.getAttributeFriendlyName(),
                                overrideProperty.getPersistValue());
                    } else {
                        if (o instanceof String) {
                            return ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(overrideProperty.getAttributeName(),
                                    overrideProperty.getAttributeFriendlyName(),
                                    Boolean.valueOf((String) o));
                        } else {
                            Boolean value = Boolean.valueOf(overrideProperty.getInvert()) ^ (Boolean) o;
                            return ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(overrideProperty.getAttributeName(),
                                    overrideProperty.getAttributeFriendlyName(),
                                    value);
                        }
                    }
                }
                return null;
            case INTEGER:
                return ATTRIBUTE_UTILITY.createAttributeWithIntegerValue(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        Integer.valueOf((String) o));
            case STRING:
            case LONG:
            case DOUBLE:
            case DURATION:
            case SPRING_BEAN_ID:
                return ATTRIBUTE_UTILITY.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        (String) o);
            case SET:
            case LIST:
            case SELECTION_LIST:
                return ATTRIBUTE_UTILITY.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                        overrideProperty.getAttributeFriendlyName(),
                        (List<String>) o);

            default:
                throw new UnsupportedOperationException("getAttributeListFromRelyingPartyOverridesRepresentation was called with an unsupported type (" + overrideProperty.getDisplayType() + ")!");
        }
    }

    // These are the types for which there are org.opensaml.core.xml.schema.XS[TYPE] definitions that we are supporting
    // The ones with comments are the types supported by the Custom Entity Attribute UI and are mapped accordingly
    // @see edu.internet2.tier.shibboleth.admin.ui.domain.CustomAttributeType (part of IRelyingPartyOverrideProperty)
    public enum AttributeTypes {
        BOOLEAN,
        INTEGER,
        STRING,
        SET,
        LIST,  
        DOUBLE, // no org.opensaml.core.xml.schema.XSTYPE - will treat as STRING
        DURATION, // no org.opensaml.core.xml.schema.XSTYPE - will treat as STRING
        LONG, // no org.opensaml.core.xml.schema.XSTYPE - will treat as STRING for generating XML
        SELECTION_LIST, // another name for LIST
        SPRING_BEAN_ID // treat as STRING
    }
}
