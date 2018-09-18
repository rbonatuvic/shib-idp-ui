package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import org.opensaml.core.xml.XMLObject;

import java.util.ArrayList;
import java.util.List;
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
            (RelyingPartyOverridesRepresentation relyingPartyOverridesRepresentation) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> list = new ArrayList<>();

        if (relyingPartyOverridesRepresentation != null) {
            if (relyingPartyOverridesRepresentation.isSignAssertion()) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(MDDCConstants.SIGN_ASSERTIONS, MDDCConstants.SIGN_ASSERTIONS_FN, true));
            }
            if (relyingPartyOverridesRepresentation.isDontSignResponse()) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(MDDCConstants.SIGN_RESPONSES, MDDCConstants.SIGN_RESPONSES_FN, false));
            }
            if (relyingPartyOverridesRepresentation.isTurnOffEncryption()) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(MDDCConstants.ENCRYPT_ASSERTIONS, MDDCConstants.ENCRYPT_ASSERTIONS_FN, false));
            }
            if (relyingPartyOverridesRepresentation.isUseSha()) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(MDDCConstants.SECURITY_CONFIGURATION, MDDCConstants
                        .SECURITY_CONFIGURATION_FN, "shibboleth.SecurityConfiguration.SHA1"));
            }
            if (relyingPartyOverridesRepresentation.isIgnoreAuthenticationMethod()) {
                // this is actually going to be wrong, but it will work for the time being. this should be a bitmask value that we calculate
                // TODO: fix
                list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(MDDCConstants.DISALLOWED_FEATURES, MDDCConstants.DISALLOWED_FEATURES_FN,
                        "0x1"));
            }
            if (relyingPartyOverridesRepresentation.isOmitNotBefore()) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithBooleanValue(MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE, MDDCConstants
                        .INCLUDE_CONDITIONS_NOT_BEFORE_FN, false));
            }
            if (relyingPartyOverridesRepresentation.getResponderId() != null && !"".equals(relyingPartyOverridesRepresentation.getResponderId())) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(MDDCConstants.RESPONDER_ID, MDDCConstants.RESPONDER_ID_FN,
                        relyingPartyOverridesRepresentation.getResponderId()));
            }
            if (relyingPartyOverridesRepresentation.getNameIdFormats() != null && relyingPartyOverridesRepresentation.getNameIdFormats().size() > 0) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(MDDCConstants.NAME_ID_FORMAT_PRECEDENCE, MDDCConstants
                        .NAME_ID_FORMAT_PRECEDENCE_FN, relyingPartyOverridesRepresentation.getNameIdFormats()));
            }
            if (relyingPartyOverridesRepresentation.getAuthenticationMethods() != null && relyingPartyOverridesRepresentation.getAuthenticationMethods().size() > 0) {
                list.add(ATTRIBUTE_UTILITY.createAttributeWithArbitraryValues(MDDCConstants.DEFAULT_AUTHENTICATION_METHODS, MDDCConstants
                        .DEFAULT_AUTHENTICATION_METHODS_FN, relyingPartyOverridesRepresentation.getAuthenticationMethods()));
            }
        }

        return (List<org.opensaml.saml.saml2.core.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) list;
    }
}
