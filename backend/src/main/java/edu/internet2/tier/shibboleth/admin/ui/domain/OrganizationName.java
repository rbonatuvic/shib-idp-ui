package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class OrganizationName extends LocalizedName implements org.opensaml.saml.saml2.metadata.OrganizationName {

}
