package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@EqualsAndHashCode(callSuper = true)
public class Organization extends AbstractAttributeExtensibleXMLObject implements org.opensaml.saml.saml2.metadata.Organization {

    @OneToOne(cascade = CascadeType.ALL)
    private Extensions extensions;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "org_orgname_id")
    private List<OrganizationName> organizationNames = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "org_orgdisplayname_id")
    private List<OrganizationDisplayName> organizationDisplayNames = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "org_orgurl_id")
    private List<OrganizationURL> organizationURLs = new ArrayList<>();

    @Override
    public org.opensaml.saml.saml2.metadata.Extensions getExtensions() {
        return extensions;
    }

    @Override
    public void setExtensions(org.opensaml.saml.saml2.metadata.Extensions extensions) {
        this.extensions = (Extensions) extensions;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.OrganizationName> getOrganizationNames() {
        return (List<org.opensaml.saml.saml2.metadata.OrganizationName>) (List<? extends org.opensaml.saml.saml2.metadata.OrganizationName>) organizationNames;
    }

    public void setOrganizationNames(List<OrganizationName> organizationNames) {
        this.organizationNames = organizationNames;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.OrganizationDisplayName> getDisplayNames() {
        return (List<org.opensaml.saml.saml2.metadata.OrganizationDisplayName>) (List<? extends org.opensaml.saml.saml2.metadata.OrganizationDisplayName>) organizationDisplayNames;
    }

    public void setOrganizationDisplayNames(List<OrganizationDisplayName> organizationDisplayNames) {
        this.organizationDisplayNames = organizationDisplayNames;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.OrganizationURL> getURLs() {
        return (List<org.opensaml.saml.saml2.metadata.OrganizationURL>) (List<? extends org.opensaml.saml.saml2.metadata.OrganizationURL>) organizationURLs;
    }

    public void setOrganizationURLs(List<OrganizationURL> organizationURLs) {
        this.organizationURLs = organizationURLs;
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        final ArrayList<XMLObject> children = new ArrayList<>();

        children.add(this.extensions);
        children.addAll(this.organizationNames);
        children.addAll(this.organizationDisplayNames);
        children.addAll(this.organizationURLs);

        return children;
    }
}


