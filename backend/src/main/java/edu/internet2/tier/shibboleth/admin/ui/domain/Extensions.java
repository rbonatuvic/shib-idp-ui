package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import java.util.Collections;
import java.util.List;


@Entity
public class Extensions extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.saml2.metadata.Extensions {
    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        return Collections.unmodifiableList(this.getUnknownXMLObjects());
    }
}
