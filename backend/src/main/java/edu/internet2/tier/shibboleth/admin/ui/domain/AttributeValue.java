package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class AttributeValue extends AbstractXMLObject implements org.opensaml.saml.saml2.core.AttributeValue {
}
