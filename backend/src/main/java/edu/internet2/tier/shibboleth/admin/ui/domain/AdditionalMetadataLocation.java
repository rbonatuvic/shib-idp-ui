package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class AdditionalMetadataLocation extends AbstractXMLObject
                implements org.opensaml.saml.saml2.metadata.AdditionalMetadataLocation {
    @Column(name = "locationuri", nullable = true) private String locationURI;

    private String namespaceURI;

    @Override
    public String getURI() {
        return locationURI;
    }

    @Override
    public void setURI(String locationURI) {
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