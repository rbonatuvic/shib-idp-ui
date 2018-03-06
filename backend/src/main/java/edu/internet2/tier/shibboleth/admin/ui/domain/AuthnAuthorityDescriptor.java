package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.collect.Lists;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;


@Entity
public class AuthnAuthorityDescriptor extends RoleDescriptor implements org.opensaml.saml.saml2.metadata.AuthnAuthorityDescriptor {

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "authnauthdesc_authnqueryserv_id")
    private List<AuthnQueryService> authnQueryServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "authnauthdesc_assertidreqserv_id")
    private List<AssertionIDRequestService> assertionIDRequestServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "authnauthdesc_nameidfmt_id")
    private List<NameIDFormat> nameIDFormats;

    @Override
    public List<org.opensaml.saml.saml2.metadata.AuthnQueryService> getAuthnQueryServices() {
        return Lists.newArrayList(authnQueryServices);
    }

    public void setAuthnQueryServices(List<AuthnQueryService> authnQueryServices) {
        this.authnQueryServices = authnQueryServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AssertionIDRequestService> getAssertionIDRequestServices() {
        return Lists.newArrayList(assertionIDRequestServices);
    }

    public void setAssertionIDRequestServices(List<AssertionIDRequestService> assertionIDRequestServices) {
        this.assertionIDRequestServices = assertionIDRequestServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.NameIDFormat> getNameIDFormats() {
        return Lists.newArrayList(nameIDFormats);
    }

    public void setNameIDFormats(List<NameIDFormat> nameIDFormats) {
        this.nameIDFormats = nameIDFormats;
    }
}
