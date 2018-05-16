package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Entity;


@Entity
@EqualsAndHashCode(callSuper = true)
public class AttributeProfile extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.AttributeProfile {

    private String profileURI;

    @Override
    public String getProfileURI() {
        return profileURI;
    }

    @Override
    public void setProfileURI(String profileURI) {
        this.profileURI = profileURI;
    }
}
