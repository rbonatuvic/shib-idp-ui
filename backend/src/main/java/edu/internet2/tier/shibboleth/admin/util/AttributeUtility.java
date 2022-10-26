package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSInteger;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import org.opensaml.core.xml.schema.XSBooleanValue;

import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class AttributeUtility {

    private OpenSamlObjects openSamlObjects;

    private static final String URI = "urn:oasis:names:tc:SAML:2.0:attrname-format:uri";

    public AttributeUtility(OpenSamlObjects openSamlObjects) {
        this.openSamlObjects = openSamlObjects;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithBooleanValue(String name, String friendlyName, Boolean value) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = createNewAttribute(name, friendlyName);

        XSBoolean xsBoolean = (XSBoolean) openSamlObjects.getBuilderFactory().getBuilder(XSBoolean.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSBoolean.TYPE_NAME);
        xsBoolean.setValue(XSBooleanValue.valueOf(value.toString()));
        attribute.getAttributeValues().add(xsBoolean);

        return attribute;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithIntegerValue(String name, String friendlyName, Integer value) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = createNewAttribute(name, friendlyName);

        XSInteger xsInteger = (XSInteger) openSamlObjects.getBuilderFactory().getBuilder(XSInteger.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSInteger.TYPE_NAME);
        xsInteger.setValue(value);
        attribute.getAttributeValues().add(xsInteger);

        return attribute;
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithStringValues(String name, String friendlyName, String... values) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = createNewAttribute(name, friendlyName);

        for (String value : values) {
            XSString xsString = (XSString) openSamlObjects.getBuilderFactory().getBuilder(XSString.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSString.TYPE_NAME);
            xsString.setValue(value);
            attribute.getAttributeValues().add(xsString);
        }

        return attribute;
    }

    /*
     * Provided for calling with name = MDDCConstants.RELEASE_ATTRIBUTES.
     */
    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithStringValues(String name, List<String> values) {
        return createAttributeWithStringValues(name, null, values);
    }

    public edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createAttributeWithStringValues(String name, String friendlyName, List<String> values) {
        if(values.size() > 0) {
            return createAttributeWithStringValues(name, friendlyName, values.toArray(new String[]{}));
        }
        return null;
    }

    /* Calling this method with name = MDDCConstants.RELEASE_ATTRIBUTES seems to be a special case. In this case,
     * we haven't been setting the friendlyName or nameFormat. Hence the null check.
     */
    private edu.internet2.tier.shibboleth.admin.ui.domain.Attribute createNewAttribute(String name, String friendlyName) {
        edu.internet2.tier.shibboleth.admin.ui.domain.Attribute attribute = ((edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder) openSamlObjects.getBuilderFactory()
                .getBuilder(edu.internet2.tier.shibboleth.admin.ui.domain.Attribute.DEFAULT_ELEMENT_NAME)).buildObject();
        attribute.setName(name);
        attribute.setNameFormat(URI); // SHIBUI-2173
        if (friendlyName != null) {
            attribute.setFriendlyName(friendlyName);
        }
        return attribute;
    }
}