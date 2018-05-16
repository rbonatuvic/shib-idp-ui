package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.collect.Lists;
import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;


@Entity
@EqualsAndHashCode(callSuper = true)
public class PDPDescriptor extends RoleDescriptor implements org.opensaml.saml.saml2.metadata.PDPDescriptor {

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "pdpdesc_authzserv_id")
    private List<AuthzService> authzServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "pdpdesc_assertidreqserv_id")
    private List<AssertionIDRequestService> assertionIDRequestServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "pdpdesc_nameidfmt_id")
    private List<NameIDFormat> nameIDFormats;

    @Override
    public List<org.opensaml.saml.saml2.metadata.AuthzService> getAuthzServices() {
        return Lists.newArrayList(authzServices);
    }

    public void setAuthzServices(List<AuthzService> authzServices) {
        this.authzServices = authzServices;
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
