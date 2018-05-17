package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Entity;


@Entity
@EqualsAndHashCode(callSuper = true)
public class AffiliateMember extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.AffiliateMember {

    private String localId;

    @Override
    public String getID() {
        return this.localId;
    }

    @Override
    public void setID(String id) {
        this.localId = id;
    }
}