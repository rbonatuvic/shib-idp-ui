package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Entity
public class Attribute extends AbstractAttributeExtensibleXMLObject implements org.opensaml.saml.saml2.core.Attribute {

    private String name;

    private String nameFormat;

    private String friendlyName;

    @OneToMany(cascade = CascadeType.ALL)
    private List<AbstractXMLObject> attributeValues = new ArrayList<>();

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getNameFormat() {
        return nameFormat;
    }

    @Override
    public void setNameFormat(String nameFormat) {
        this.nameFormat = nameFormat;
    }

    @Override
    public String getFriendlyName() {
        return friendlyName;
    }

    @Override
    public void setFriendlyName(String friendlyName) {
        this.friendlyName = friendlyName;
    }

    @Override
    public List<XMLObject> getAttributeValues() {
        return (List<XMLObject>) (List<? extends XMLObject>) this.attributeValues;
    }

    public void setAttributeValues(List<AbstractXMLObject> attributeValues) {
        this.attributeValues = attributeValues;
    }

    public void addAttributeValue(AbstractXMLObject attributeValue) {
        this.attributeValues.add(attributeValue);
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        children.addAll(attributeValues);

        return Collections.unmodifiableList(children);
    }

    @Override
    public String toString() {
        return "Attribute{" +
                "name='" + name + "\'\n" +
                ", nameFormat='" + nameFormat + "\'\n" +
                ", friendlyName='" + friendlyName + "\'\n" +
                ", attributeValues=" + attributeValues +
                "\n}";
    }
}
