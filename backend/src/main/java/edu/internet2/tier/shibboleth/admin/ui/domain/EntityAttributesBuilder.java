package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractSAMLObjectBuilder;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class EntityAttributesBuilder extends AbstractSAMLObjectBuilder<EntityAttributes> {
    @Nonnull
    @Override
    public EntityAttributes buildObject() {
        return buildObject(EntityAttributes.DEFAULT_ELEMENT_NAME.getNamespaceURI(), EntityAttributes.DEFAULT_ELEMENT_NAME.getLocalPart(), EntityAttributes.DEFAULT_ELEMENT_NAME.getPrefix());
    }

    @Nonnull
    @Override
    public EntityAttributes buildObject(@Nullable String namespaceURI, @Nonnull String localName, @Nullable String namespacePrefix) {
        EntityAttributes o = new EntityAttributes();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }
}
