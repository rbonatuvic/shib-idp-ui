package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class InformationURL extends AbstractLangBearingURL implements org.opensaml.saml.ext.saml2mdui.InformationURL {
}
