package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class SPSSODescriptor extends SSODescriptor implements org.opensaml.saml.saml2.metadata.SPSSODescriptor {

    private Boolean isAuthnRequestsSigned;

    private Boolean wantAssertionsSigned;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "spssodesc_attribconsserv_id")
    @OrderColumn
    private List<AttributeConsumingService> attributeConsumingServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "spssodesc_assertconsserv_id")
    @OrderColumn
    private List<AssertionConsumerService> assertionConsumerServices = new ArrayList<>();


    @Override
    public Boolean isAuthnRequestsSigned() {
        return this.isAuthnRequestsSigned == null ? false : this.isAuthnRequestsSigned;
    }

    @Override
    public XSBooleanValue isAuthnRequestsSignedXSBoolean() {
        if (this.isAuthnRequestsSigned == null) {
            return null;
        }
        return XSBooleanValue.valueOf(Boolean.toString(isAuthnRequestsSigned));
    }

    @Override
    public void setAuthnRequestsSigned(Boolean isAuthnRequestsSigned) {
        this.isAuthnRequestsSigned = isAuthnRequestsSigned;
    }

    @Override
    public void setAuthnRequestsSigned(XSBooleanValue xsBooleanValue) {
        //TODO?
    }

    @Override
    public Boolean getWantAssertionsSigned() {
        return wantAssertionsSigned == null ? false : wantAssertionsSigned;
    }

    @Override
    public XSBooleanValue getWantAssertionsSignedXSBoolean() {
        if (this.wantAssertionsSigned == null) {
            return null;
        }
        return XSBooleanValue.valueOf(Boolean.toString(wantAssertionsSigned));
    }

    @Override
    public void setWantAssertionsSigned(Boolean wantAssertionsSigned) {
        this.wantAssertionsSigned = wantAssertionsSigned;
    }

    @Override
    public void setWantAssertionsSigned(XSBooleanValue xsBooleanValue) {
        //TODO?
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AssertionConsumerService> getAssertionConsumerServices() {
        return (List<org.opensaml.saml.saml2.metadata.AssertionConsumerService>)(List<? extends org.opensaml.saml.saml2.metadata.AssertionConsumerService>)this.assertionConsumerServices;
    }

    public void setAssertionConsumerServices(List<AssertionConsumerService> assertionConsumerServices) {
        this.assertionConsumerServices = assertionConsumerServices;
    }

    @Override
    public AssertionConsumerService getDefaultAssertionConsumerService() {
        return null; //TODO?
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AttributeConsumingService> getAttributeConsumingServices() {
        return (List<org.opensaml.saml.saml2.metadata.AttributeConsumingService>)(List<? extends org.opensaml.saml.saml2.metadata.AttributeConsumingService>) attributeConsumingServices;
    }

    public void setAttributeConsumingServices(List<AttributeConsumingService> attributeConsumingServices) {
        this.attributeConsumingServices = attributeConsumingServices;
    }

    @Override
    public AttributeConsumingService getDefaultAttributeConsumingService() {
        return null; //TODO?
    }

    @Nullable
    @Override
    @Transient
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        children.addAll(super.getOrderedChildren());
        children.addAll(this.getAssertionConsumerServices());
        children.addAll(this.getAttributeConsumingServices());

        return Collections.unmodifiableList(children);
    }

    @Transient
    public Optional<Extensions> getOptionalExtensions() {
        return Optional.ofNullable(this.getExtensions());
    }
}