package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.common.SAMLObject;
import org.opensaml.saml.ext.saml2mdattr.impl.EntityAttributesImpl;
import org.opensaml.saml.saml2.core.Assertion;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class EntityAttributes extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.ext.saml2mdattr.EntityAttributes {

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<Attribute> attributes = new ArrayList<>();

    @Transient // TODO: check to make sure this won't ever be used
    private List<Assertion> assertions = new ArrayList<>();

    @Override
    public List<org.opensaml.saml.saml2.core.Attribute> getAttributes() {
        return (List<org.opensaml.saml.saml2.core.Attribute>) (List<? extends org.opensaml.saml.saml2.core.Attribute>) this.attributes;
    }

    public void addAttribute(Attribute attribute) {
        this.attributes.add(attribute);
    }

    @Override
    public List<Assertion> getAssertions() {
        return this.assertions;
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        if (this.getAssertions().size() == 0 && this.getAttributes().size() == 0) {
            return null;
        }

        children.addAll(this.getAttributes());
        children.addAll(this.getAssertions());

        return Collections.unmodifiableList(children);
    }

    @Override
    public List<SAMLObject> getEntityAttributesChildren() {
        ArrayList<SAMLObject> children = new ArrayList<>();

        if (this.getAssertions().size() == 0 && this.getAttributes().size() == 0) {
            return null;
        }

        children.addAll(this.getAttributes());
        children.addAll(this.getAssertions());
        return children;
    }
}