package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import net.shibboleth.utilities.java.support.xml.ElementSupport;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.io.AbstractXMLObjectMarshaller;
import org.opensaml.core.xml.io.MarshallingException;
import org.w3c.dom.Element;

public class ValueXMLMarshaller extends AbstractXMLObjectMarshaller {
    protected void marshallElementContent(final XMLObject xmlObject, final Element domElement) throws MarshallingException {
        final ValueXMLObject valueXMLObject = (ValueXMLObject) xmlObject;
        ElementSupport.appendTextContent(domElement, valueXMLObject.getValue());
    }
}