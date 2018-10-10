package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.RelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import org.opensaml.core.xml.XMLObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Utility class to deal with model conversions related functionality
 */
public abstract class ModelRepresentationConversions {

    private static final AttributeUtility ATTRIBUTE_UTILITY;

    static {
        OpenSamlObjects openSamlObjects = new OpenSamlObjects();
        try {
            openSamlObjects.init();
        }
        catch (ComponentInitializationException e) {
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

    public static RelyingPartyOverridesRepresentation getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList) {
        RelyingPartyOverridesRepresentation relyingPartyOverridesRepresentation = new RelyingPartyOverridesRepresentation();

        for (org.opensaml.saml.saml2.core.Attribute attribute : attributeList) {
            Attribute jpaAttribute = (Attribute) attribute;
            // TODO: this is going to get real ugly real quick. clean it up, future Jj!
            switch (jpaAttribute.getName()) {
                case MDDCConstants.SIGN_ASSERTIONS:
                    relyingPartyOverridesRepresentation.setSignAssertion(getBooleanValueOfAttribute(jpaAttribute));
                    break;
                case MDDCConstants.SIGN_RESPONSES:
                    relyingPartyOverridesRepresentation.setDontSignResponse(!getBooleanValueOfAttribute(jpaAttribute));
                    break;
                case MDDCConstants.ENCRYPT_ASSERTIONS:
                    relyingPartyOverridesRepresentation.setTurnOffEncryption(!getBooleanValueOfAttribute(jpaAttribute));
                    break;
                case MDDCConstants.SECURITY_CONFIGURATION:
                    if (getStringListValueOfAttribute(jpaAttribute).contains("shibboleth.SecurityConfiguration.SHA1")) {
                        relyingPartyOverridesRepresentation.setUseSha(true);
                    }
                    break;
                case MDDCConstants.DISALLOWED_FEATURES:
                    if ((Integer.decode(getStringListValueOfAttribute(jpaAttribute).get(0)) & 0x1) == 0x1) {
                        relyingPartyOverridesRepresentation.setIgnoreAuthenticationMethod(true);
                    }
                    break;
                case MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE:
                    relyingPartyOverridesRepresentation.setOmitNotBefore(!getBooleanValueOfAttribute(jpaAttribute));
                    break;
                case MDDCConstants.RESPONDER_ID:
                    relyingPartyOverridesRepresentation.setResponderId(getStringListValueOfAttribute(jpaAttribute).get(0));
                    break;
                case MDDCConstants.NAME_ID_FORMAT_PRECEDENCE:
                    relyingPartyOverridesRepresentation.setNameIdFormats(getStringListValueOfAttribute(jpaAttribute));
                    break;
                case MDDCConstants.DEFAULT_AUTHENTICATION_METHODS:
                    relyingPartyOverridesRepresentation.setAuthenticationMethods(getStringListValueOfAttribute(jpaAttribute));
                    break;
                case MDDCConstants.FORCE_AUTHN:
                    relyingPartyOverridesRepresentation.setForceAuthn(getBooleanValueOfAttribute(jpaAttribute));
                    break;
                default:
                    break;
            }
        }

        return relyingPartyOverridesRepresentation;
    }

    public static List<org.opensaml.saml.saml2.core.Attribute> getAttributeListFromAttributeReleaseList(List<String> attributeReleaseList) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> attributeList = new ArrayList<>();

        if (attributeReleaseList != null && attributeReleaseList.size() > 0) {
            attributeList.add(ATTRIBUTE_UTILITY.createAttributeWithStringValues(MDDCConstants.RELEASE_ATTRIBUTES, attributeReleaseList));
        }

        return (List<org.opensaml.saml.saml2.core.Attribute>)(List<? extends org.opensaml.saml.saml2.core.Attribute>)attributeList;
    }

    public static List<org.opensaml.saml.saml2.core.Attribute> getAttributeListFromRelyingPartyOverridesRepresentation
            (List<RelyingPartyOverrideProperty> overridePropertyList,
             Map<String, Object> relyingPartyOverridesRepresentation) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> list = new ArrayList<>();

        for (Map.Entry entry : relyingPartyOverridesRepresentation.entrySet()) {
            String key = (String) entry.getKey();
            RelyingPartyOverrideProperty overrideProperty = overridePropertyList.stream().filter(op -> op.getDisplayName().equals(key)).findFirst().get();
            switch (AttributeTypes.valueOf(overrideProperty.getDisplayType())) {
                case BOOLEAN:
                    if (!overrideProperty.getPersistType().equals("boolean")) {
                        // we must be persisting a string then
                        list.add(ATTRIBUTE_UTILITY.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                                                                                   overrideProperty.getAttributeFriendlyName(),
                                                                                   (String) entry.getValue());
                    } else {
                        list.add(ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(overrideProperty.getAttributeName(),
                                                                                   overrideProperty.getAttributeFriendlyName(),
                                                                                   Boolean.valueOf((String) entry.getValue()));
                    }
                    break;
                case INTEGER:
                    list.add(ATTRIBUTE_UTILITY.createAttributeWithIntegerValue(overrideProperty.getAttributeName(),
                                                                               overrideProperty.getAttributeFriendlyName(),
                                                                               Integer.valueOf((String) entry.getValue())));
                    break;
                case STRING:
                    list.add(ATTRIBUTE_UTILITY.createAttributeWithStringValues(overrideProperty.getAttributeName(),
                                                                               overrideProperty.getAttributeFriendlyName(),
                                                                               (String) entry.getValue()));
                    break;
                case SET:
                    list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(overrideProperty.getAttributeName(),
                                                                                  overrideProperty.getAttributeFriendlyName(),
                                                                                  (Set<String>) entry.getValue()));
                    break;
                case LIST:
                    list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(overrideProperty.getAttributeName(),
                                                                                  overrideProperty.getAttributeFriendlyName(),
                                                                                  (List<String>) entry.getValue()));
                    break;
                default:
                    throw new UnsupportedOperationException("getAttributeListFromRelyingPartyOverridesRepresentation was called with an unsupported type (" + overrideProperty.getDisplayType() + ")!");
            }
        }

        return (List<org.opensaml.saml.saml2.core.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) list;
    }


    private enum AttributeTypes {
        BOOLEAN("boolean"),
        INTEGER("integer"),
        STRING("string"),
        SET("set"),
        LIST("list");

        private final String type;

        AttributeTypes(final String type) {
            this.type = type;
        }

        @Override
        public String toString() {
            return type;
        }
        }
}
