package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.collect.Lists;
import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
public class SSODescriptor extends RoleDescriptor implements org.opensaml.saml.saml2.metadata.SSODescriptor {

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ssodesc_artifctresserv_id")
    private List<ArtifactResolutionService> artifactResolutionServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ssodesc_singlelogoutserv_id")
    private List<SingleLogoutService> singleLogoutServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ssodesc_managenameidserv_id")
    private List<ManageNameIDService> manageNameIDServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ssodesc_nameidfmt_id")
    private List<NameIDFormat> nameIDFormats = new ArrayList<>();

    @Override
    public List<org.opensaml.saml.saml2.metadata.ArtifactResolutionService> getArtifactResolutionServices() {
        return Lists.newArrayList(artifactResolutionServices);
    }

    public void setArtifactResolutionServices(List<ArtifactResolutionService> artifactResolutionServices) {
        this.artifactResolutionServices = artifactResolutionServices;
    }

    @Override
    public ArtifactResolutionService getDefaultArtifactResolutionService() {
        return null; //TODO?
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.SingleLogoutService> getSingleLogoutServices() {
        return (List<org.opensaml.saml.saml2.metadata.SingleLogoutService>) (List<? extends org.opensaml.saml.saml2.metadata.SingleLogoutService>) this.singleLogoutServices;
    }

    public void setSingleLogoutServices(List<SingleLogoutService> singleLogoutServices) {
        this.singleLogoutServices = singleLogoutServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.ManageNameIDService> getManageNameIDServices() {
        return Lists.newArrayList(manageNameIDServices);
    }

    public void setManageNameIDServices(List<ManageNameIDService> manageNameIDServices) {
        this.manageNameIDServices = manageNameIDServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.NameIDFormat> getNameIDFormats() {
        return (List<org.opensaml.saml.saml2.metadata.NameIDFormat>) (List<? extends org.opensaml.saml.saml2.metadata.NameIDFormat>) nameIDFormats;
    }

    public void setNameIDFormats(List<NameIDFormat> nameIDFormats) {
        this.nameIDFormats = nameIDFormats;
    }

    @Nullable
    @Override
    @Transient
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        children.addAll(super.getOrderedChildren());
        children.addAll(this.getArtifactResolutionServices());
        children.addAll(this.getSingleLogoutServices());
        children.addAll(this.getManageNameIDServices());
        children.addAll(this.getNameIDFormats());

        return Collections.unmodifiableList(children);
    }
}
