package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.persistence.Entity;


@Entity
public class AdditionalMetadataLocation extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.AdditionalMetadataLocation {

    private String locationURI;

    private String namespaceURI;

    @Override
    public String getLocationURI() {
        return locationURI;
    }

    @Override
    public void setLocationURI(String locationURI) {
        this.locationURI = locationURI;
    }

    @Override
    public String getNamespaceURI() {
        return namespaceURI;
    }

    @Override
    public void setNamespaceURI(String namespaceURI) {
        this.namespaceURI = namespaceURI;
    }
}
