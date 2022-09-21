package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Audited
public class PostLogoutRedirectUri extends AbstractValueXMLObject implements net.shibboleth.oidc.saml.xmlobject.PostLogoutRedirectUri {
    public PostLogoutRedirectUri(String value) {
        this.setValue(value);
    }
}