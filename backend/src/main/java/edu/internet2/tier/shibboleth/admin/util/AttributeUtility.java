package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSAny;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import org.opensaml.core.xml.schema.XSBooleanValue;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class AttributeUtility {

    private OpenSamlObjects openSamlObjects;

    public AttributeUtility(OpenSamlObjects openSamlObjects) {
        this.openSamlObjects = openSamlObjects;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithBooleanValue(String name, String friendlyName, Boolean value) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = ((edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder) openSamlObjects.getBuilderFactory().getBuilder(edu.internet2.tier.shibboleth.admin.ui.domain.Attribute.DEFAULT_ELEMENT_NAME)).buildObject();
        attribute.setName(name);
        attribute.setFriendlyName(friendlyName);
        attribute.setNameFormat("urn:oasis:names:tc:SAML:2.0:attrname-format:uri");

        XSBoolean xsBoolean = (XSBoolean) openSamlObjects.getBuilderFactory().getBuilder(XSBoolean.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSBoolean.TYPE_NAME);
        xsBoolean.setValue(XSBooleanValue.valueOf(value.toString()));

        attribute.getAttributeValues().add(xsBoolean);
        return attribute;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithStringValues(String name, List<String> values) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = ((edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder) openSamlObjects.getBuilderFactory()
                .getBuilder(edu.internet2.tier.shibboleth.admin.ui.domain.Attribute.DEFAULT_ELEMENT_NAME)).buildObject();
        attribute.setName(name);
        //TODO: Do we need a friendlyName?
        //TODO: Do we need a NameFormat?

        values.forEach(attributeString -> {
            XSString xsString = (XSString) openSamlObjects.getBuilderFactory().getBuilder(XSString.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSString.TYPE_NAME);
            xsString.setValue(attributeString);
            attribute.getAttributeValues().add(xsString);
        });
        return attribute;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithArbitraryValues(String name, String friendlyName, String... values) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = ((edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder) openSamlObjects.getBuilderFactory().getBuilder(edu.internet2.tier.shibboleth.admin.ui.domain.Attribute.DEFAULT_ELEMENT_NAME)).buildObject();
        attribute.setName(name);
        attribute.setFriendlyName(friendlyName);
        attribute.setNameFormat("urn:oasis:names:tc:SAML:2.0:attrname-format:uri");

        for (String value : values) {
            XSAny xsAny = (XSAny) openSamlObjects.getBuilderFactory().getBuilder(XSAny.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME);
            xsAny.setTextContent(value);
            attribute.getAttributeValues().add(xsAny);
        }

        return attribute;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithArbitraryValues(String name, String friendlyName, List<String> values) {
        return createAttributeWithArbitraryValues(name, friendlyName, values.toArray(new String[]{}));
    }
}
