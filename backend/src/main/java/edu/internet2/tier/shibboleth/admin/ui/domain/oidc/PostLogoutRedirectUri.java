package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class PostLogoutRedirectUri extends AbstractValueXMLObject implements net.shibboleth.oidc.saml.xmlobject.PostLogoutRedirectUri {
}