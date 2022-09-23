package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Audited
public class RequestUri extends AbstractValueXMLObject implements net.shibboleth.oidc.saml.xmlobject.RequestUri {
}