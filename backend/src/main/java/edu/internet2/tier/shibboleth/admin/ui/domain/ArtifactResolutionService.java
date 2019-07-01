package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;


@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class ArtifactResolutionService extends IndexedEndpoint implements org.opensaml.saml.saml2.metadata.ArtifactResolutionService {
}
