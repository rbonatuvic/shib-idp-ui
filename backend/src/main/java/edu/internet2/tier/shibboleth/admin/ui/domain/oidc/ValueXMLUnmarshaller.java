package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.io.AbstractXMLObjectUnmarshaller;

public class ValueXMLUnmarshaller  extends AbstractXMLObjectUnmarshaller {
    protected void processElementContent(final XMLObject xmlObject, final String elementContent) {
        final ValueXMLObject valueXMLObject = (ValueXMLObject) xmlObject;
        valueXMLObject.setValue(elementContent);
    }
}