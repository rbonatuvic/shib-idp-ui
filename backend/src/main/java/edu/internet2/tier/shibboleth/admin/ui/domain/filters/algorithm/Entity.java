package edu.internet2.tier.shibboleth.admin.ui.domain.filters.algorithm;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;

import javax.annotation.Nullable;

public class Entity extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSString {
    private String uri;

    private Entity(){
        setElementLocalName("Entity");
    }

    @Nullable
    @Override
    public String getValue() {
        return this.uri;
    }

    @Override
    public void setValue(@Nullable String newValue) {
        this.uri = newValue;
    }
}