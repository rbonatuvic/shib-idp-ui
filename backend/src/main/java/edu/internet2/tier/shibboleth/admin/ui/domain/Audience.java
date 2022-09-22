package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Audited
public class Audience extends AbstractXMLObject implements org.opensaml.saml.saml2.core.Audience {
    @Getter
    @Setter
    private String URI;

    public Audience(String value) {
        this.setURI(value);
    }
}