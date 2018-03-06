package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nonnull;
import javax.persistence.Entity;
import javax.xml.namespace.QName;
import java.util.List;


/**
 * Note: This also should extend AbstractElementExtensibleXMLObject, but we can't in Java.
 */
@Entity
public class Endpoint extends AbstractAttributeExtensibleXMLObject implements org.opensaml.saml.saml2.metadata.Endpoint {

    private String binding;

    private String location;

    private String responseLocation;

    @Override
    public String getBinding() {
        return binding;
    }

    @Override
    public void setBinding(String binding) {
        this.binding = binding;
    }

    @Override
    public String getLocation() {
        return location;
    }

    @Override
    public void setLocation(String location) {
        this.location = location;
    }

    @Override
    public String getResponseLocation() {
        return responseLocation;
    }

    @Override
    public void setResponseLocation(String responseLocation) {
        this.responseLocation = responseLocation;
    }

    /**
     * This should come from AbstractElementExtensibleXMLObject
     * @return
     */
    @Nonnull
    @Override
    public List<XMLObject> getUnknownXMLObjects() {
        return null; //TODO
    }

    /**
     * This also should come from AbstractElementExtensibleXMLObject
     * @param qName
     * @return
     */
    @Nonnull
    @Override
    public List<XMLObject> getUnknownXMLObjects(@Nonnull QName qName) {
        return null; //TODO
    }
}