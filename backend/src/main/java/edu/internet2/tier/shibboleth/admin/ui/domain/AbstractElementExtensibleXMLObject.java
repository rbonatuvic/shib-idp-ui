package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.ElementExtensibleXMLObject;
import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nonnull;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class AbstractElementExtensibleXMLObject extends AbstractXMLObject implements ElementExtensibleXMLObject {
    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<AbstractXMLObject> unknownXMLObjects = new ArrayList<>();

    @Nonnull
    @Override
    public List<XMLObject> getUnknownXMLObjects() {
        return (List<XMLObject>) (List<? extends XMLObject>) this.unknownXMLObjects;
    }

    @Nonnull
    @Override
    public List<XMLObject> getUnknownXMLObjects(@Nonnull QName qName) {
        return this.unknownXMLObjects.stream().filter(p -> p.getElementQName().equals(qName)).collect(Collectors.toList());
    }

    public void addUnknownXMLObject(AbstractXMLObject xmlObject) {
        this.unknownXMLObjects.add(xmlObject);
    }
}
