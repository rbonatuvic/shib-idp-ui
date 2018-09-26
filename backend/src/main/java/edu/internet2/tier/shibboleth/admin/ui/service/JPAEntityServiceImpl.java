package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder;
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility;
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants;
import org.opensaml.saml.saml2.core.Attribute;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class JPAEntityServiceImpl implements EntityService {

    @Autowired
    private OpenSamlObjects openSamlObjects;

    @Autowired
    private AttributeUtility attributeUtility;

    public JPAEntityServiceImpl(OpenSamlObjects openSamlObjects) {
        this.openSamlObjects = openSamlObjects;
    }

    public JPAEntityServiceImpl(OpenSamlObjects openSamlObjects, AttributeUtility attributeUtility) {
        this.openSamlObjects = openSamlObjects;
        this.attributeUtility = attributeUtility;
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

    @Override
    public List<Attribute> getAttributeListFromRelyingPartyOverridesRepresentation(RelyingPartyOverridesRepresentation relyingPartyOverridesRepresentation) {
        List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute> list = new ArrayList<>();

        if (relyingPartyOverridesRepresentation != null) {
            if (relyingPartyOverridesRepresentation.isSignAssertion()) {
                list.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.SIGN_ASSERTIONS, MDDCConstants.SIGN_ASSERTIONS_FN, true));
            }
            if (relyingPartyOverridesRepresentation.isDontSignResponse()) {
                list.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.SIGN_RESPONSES, MDDCConstants.SIGN_RESPONSES_FN, false));
            }
            if (relyingPartyOverridesRepresentation.isTurnOffEncryption()) {
                list.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.ENCRYPT_ASSERTIONS, MDDCConstants.ENCRYPT_ASSERTIONS_FN, false));
            }
            if (relyingPartyOverridesRepresentation.isUseSha()) {
                list.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.SECURITY_CONFIGURATION, MDDCConstants.SECURITY_CONFIGURATION_FN, "shibboleth.SecurityConfiguration.SHA1"));
            }
            if (relyingPartyOverridesRepresentation.isIgnoreAuthenticationMethod()) {
                // this is actually going to be wrong, but it will work for the time being. this should be a bitmask value that we calculate
                // TODO: fix
                list.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.DISALLOWED_FEATURES, MDDCConstants.DISALLOWED_FEATURES_FN, "0x1"));
            }
            if (relyingPartyOverridesRepresentation.isOmitNotBefore()) {
                list.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE, MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE_FN, false));
            }
            if (relyingPartyOverridesRepresentation.getResponderId() != null && !"".equals(relyingPartyOverridesRepresentation.getResponderId())) {
                list.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.RESPONDER_ID, MDDCConstants.RESPONDER_ID_FN, relyingPartyOverridesRepresentation.getResponderId()));
            }
            if (relyingPartyOverridesRepresentation.getNameIdFormats() != null && relyingPartyOverridesRepresentation.getNameIdFormats().size() > 0) {
                list.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.NAME_ID_FORMAT_PRECEDENCE, MDDCConstants.NAME_ID_FORMAT_PRECEDENCE_FN, relyingPartyOverridesRepresentation.getNameIdFormats()));
            }
            if (relyingPartyOverridesRepresentation.getAuthenticationMethods() != null && relyingPartyOverridesRepresentation.getAuthenticationMethods().size() > 0) {
                list.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.DEFAULT_AUTHENTICATION_METHODS, MDDCConstants.DEFAULT_AUTHENTICATION_METHODS_FN, relyingPartyOverridesRepresentation.getAuthenticationMethods()));
            }
            if (relyingPartyOverridesRepresentation.isForceAuthn()) {
                list.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.FORCE_AUTHN, MDDCConstants.FORCE_AUTHN_FN, true));
            }
        }

        return (List<Attribute>)(List<? extends Attribute>)list;
    }
}
