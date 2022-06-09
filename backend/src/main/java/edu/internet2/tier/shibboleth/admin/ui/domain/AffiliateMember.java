package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class AffiliateMember extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.AffiliateMember {
    @Column(name = "local_id")
    private String uri;

    @Override
    public String getURI() {
        return this.uri;
    }

    @Override
    public void setURI(String uri) {
        this.uri = uri;
    }
}