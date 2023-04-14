package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.xmlsec.encryption.AgreementMethod;
import org.opensaml.xmlsec.encryption.EncryptedKey;
import org.opensaml.xmlsec.signature.DEREncodedKeyValue;
import org.opensaml.xmlsec.signature.KeyInfoReference;
import org.opensaml.xmlsec.signature.KeyName;
import org.opensaml.xmlsec.signature.KeyValue;
import org.opensaml.xmlsec.signature.MgmtData;
import org.opensaml.xmlsec.signature.PGPData;
import org.opensaml.xmlsec.signature.RetrievalMethod;
import org.opensaml.xmlsec.signature.SPKIData;
import org.opensaml.xmlsec.signature.X509Data;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class KeyInfo extends AbstractXMLObject implements org.opensaml.xmlsec.signature.KeyInfo {

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    List<AbstractXMLObject> xmlObjects = new ArrayList<>();


    @Nullable
    @Override
    public String getID() {
        return null;
    }

    @Override
    public void setID(@Nullable String newID) {}

    @Nonnull
    @Override
    public List<XMLObject> getXMLObjects() {
        return (List<XMLObject>) (List<? extends XMLObject>) this.xmlObjects;
    }

    @Nonnull
    @Override
    public List<XMLObject> getXMLObjects(@Nonnull QName typeOrName) {
        return this.getXMLObjects().stream().filter(p -> p.getElementQName().equals(typeOrName) || p.getSchemaType().equals(typeOrName)).collect(Collectors.toList());
    }

    @Nonnull
    @Override
    public List<KeyName> getKeyNames() {
        List<KeyName> result = new ArrayList<>();
        getXMLObjects().forEach(obj -> {
            if (obj instanceof KeyName){
                result.add((KeyName)obj);
            }
        });
        return result;

    }

    @Nonnull
    @Override
    public List<KeyValue> getKeyValues() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<DEREncodedKeyValue> getDEREncodedKeyValues() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<RetrievalMethod> getRetrievalMethods() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<KeyInfoReference> getKeyInfoReferences() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<X509Data> getX509Datas() {
        return new X509ArrayList(this, Arrays.asList(this.xmlObjects.stream().filter(i -> i instanceof X509Data).toArray(X509Data[]::new)));
    }

    public void addX509Data(edu.internet2.tier.shibboleth.admin.ui.domain.X509Data x509Data) {
        this.xmlObjects.add(x509Data);
    }

    @Nonnull
    @Override
    public List<PGPData> getPGPDatas() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<SPKIData> getSPKIDatas() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<MgmtData> getMgmtDatas() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<AgreementMethod> getAgreementMethods() {
        return Collections.emptyList();
    }

    @Nonnull
    @Override
    public List<EncryptedKey> getEncryptedKeys() {
        ArrayList<EncryptedKey> result = new ArrayList<>();
        for (XMLObject obj : getXMLObjects()) {
            if (obj instanceof EncryptedKey) {
                result.add((EncryptedKey) obj);
            }
        }
        return result;
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        children.addAll(this.getXMLObjects());

        if (children.size() == 0) {
            return null;
        }

        return children;
    }
}

class X509ArrayList extends ArrayList<X509Data> {
    private KeyInfo parentRef;

    public X509ArrayList(KeyInfo ref, List<X509Data> addlist) {
        super(addlist);
        this.parentRef = ref;
    }

    @Override
    public boolean add(X509Data data) {
        parentRef.addX509Data((edu.internet2.tier.shibboleth.admin.ui.domain.X509Data) data);
        return super.add(data);
    }
}