package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Entity
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class RequestInitiator extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.ext.saml2mdreqinit.RequestInitiator {
    @EqualsAndHashCode.Include
    private String binding;
    @Override
    public String getBinding() {
        return this.binding;
    }

    @Override
    public void setBinding(String binding) {
        this.binding = binding;
    }

    @EqualsAndHashCode.Include
    private String location;

    @Override
    public String getLocation() {
        return location;
    }

    @Override
    public void setLocation(String location) {
        this.location = location;
    }

    @EqualsAndHashCode.Include
    private String responseLocation;

    @Override
    public String getResponseLocation() {
        return this.responseLocation;
    }

    @Override
    public void setResponseLocation(String location) {
        this.responseLocation = location;
    }

    @ElementCollection
    private Map<QName,String> storageAttributeMap = new HashMap<>();

    @Transient
    private AttributeMap attributeMap = new AttributeMap(this);

    @EqualsAndHashCode.Include
    private Set<Map.Entry<QName, String>> attributeMapEntrySet() {
        return this.attributeMap.entrySet();
    }

    @PrePersist
    void prePersist() {
        this.storageAttributeMap = this.attributeMap;
    }

    @PostLoad
    void postLoad() {
        this.attributeMap.putAll(this.storageAttributeMap);
    }

    @Nonnull
    @Override
    @Transient
    public AttributeMap getUnknownAttributes() {
        return this.attributeMap;
    }
}
