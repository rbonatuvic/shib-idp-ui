package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.xmlsec.signature.X509CRL;
import org.opensaml.xmlsec.signature.X509Certificate;
import org.opensaml.xmlsec.signature.X509Digest;
import org.opensaml.xmlsec.signature.X509IssuerSerial;
import org.opensaml.xmlsec.signature.X509SKI;
import org.opensaml.xmlsec.signature.X509SubjectName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@EqualsAndHashCode(callSuper = true)
public class X509Data extends AbstractXMLObject implements org.opensaml.xmlsec.signature.X509Data {
    @OneToMany(cascade = CascadeType.ALL)
    List<AbstractXMLObject> xmlObjects = new ArrayList<>();

    @Nonnull
    @Override
    public List<XMLObject> getXMLObjects() {
        return (List<XMLObject>) (List<? extends XMLObject>) this.xmlObjects;
    }

    @Nonnull
    @Override
    public List<XMLObject> getXMLObjects(@Nonnull QName typeOrName) {
        return this.xmlObjects.stream().filter(i -> i.getElementQName().equals(typeOrName) || i.getSchemaType().equals(typeOrName)).collect(Collectors.toList());
    }

    public void setXmlObjects(List<AbstractXMLObject> xmlObjects) {
        this.xmlObjects = xmlObjects;
    }

    @Nonnull
    @Override
    public List<X509IssuerSerial> getX509IssuerSerials() {
        return null;
    }

    @Nonnull
    @Override
    public List<X509SKI> getX509SKIs() {
        return null;
    }

    @Nonnull
    @Override
    public List<X509SubjectName> getX509SubjectNames() {
        return null;
    }

    @Nonnull
    @Override
    public List<X509Certificate> getX509Certificates() {
        return Arrays.asList(this.xmlObjects.stream().filter(i -> i instanceof org.opensaml.xmlsec.signature.X509Certificate).toArray(org.opensaml.xmlsec.signature.X509Certificate[]::new));
    }

    public void addX509Certificate(edu.internet2.tier.shibboleth.admin.ui.domain.X509Certificate x509Certificate) {
        this.xmlObjects.add(x509Certificate);
    }

    @Nonnull
    @Override
    public List<X509CRL> getX509CRLs() {
        return null;
    }

    @Nonnull
    @Override
    public List<X509Digest> getX509Digests() {
        return null;
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        List<XMLObject> children = new ArrayList<>();

        children.addAll(this.getX509Certificates());

        return children;
    }
}
