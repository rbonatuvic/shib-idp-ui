package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;


@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class AttributeConsumingService extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.AttributeConsumingService {

    private int acsIndex;

    private boolean isDefault;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribconsserv_servicename_id")
    @OrderColumn
    private List<ServiceName> serviceNames = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribconsserv_servicedesc_id")
    @OrderColumn
    private List<ServiceDescription> serviceDescriptions = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribconsserv_requestedattrib_id")
    @OrderColumn
    private List<RequestedAttribute> requestedAttributes = new ArrayList<>();

    @Override
    public int getIndex() {
        return acsIndex;
    }

    @Override
    public void setIndex(int index) {
        this.acsIndex = index;
    }

    @Override
    public Boolean isDefault() {
        return isDefault;
    }

    @Override
    public XSBooleanValue isDefaultXSBoolean() {
        return null; //TODO?
    }

    @Override
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    @Override
    public void setIsDefault(XSBooleanValue xsBooleanValue) {
        //TODO?
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.ServiceName> getNames() {
        return (List<org.opensaml.saml.saml2.metadata.ServiceName>) (List<? extends org.opensaml.saml.saml2.metadata.ServiceName>) this.serviceNames;
    }

    public void setServiceNames(List<ServiceName> serviceNames) {
        this.serviceNames = serviceNames;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.ServiceDescription> getDescriptions() {
        return (List<org.opensaml.saml.saml2.metadata.ServiceDescription>) (List<? extends org.opensaml.saml.saml2.metadata.ServiceDescription>) this.serviceDescriptions;
    }

    public void setServiceDescriptions(List<ServiceDescription> serviceDescriptions) {
        this.serviceDescriptions = serviceDescriptions;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.RequestedAttribute> getRequestAttributes() {
        return (List<org.opensaml.saml.saml2.metadata.RequestedAttribute>) (List<? extends org.opensaml.saml.saml2.metadata.RequestedAttribute>) this.requestedAttributes;
    }

    public void setRequestedAttributes(List<RequestedAttribute> requestedAttributes) {
        this.requestedAttributes = requestedAttributes;
    }
}
