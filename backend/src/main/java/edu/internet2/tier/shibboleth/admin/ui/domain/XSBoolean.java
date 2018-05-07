package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Transient;

@Entity
@EqualsAndHashCode(callSuper = true)
public class XSBoolean extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSBoolean {
    private String storedValue;

    @Nullable
    @Override
    @Transient
    public XSBooleanValue getValue() {
        return XSBooleanValue.valueOf(this.storedValue);
    }

    @Override
    public void setValue(@Nullable XSBooleanValue value) {
        this.storedValue = value.getValue().toString();
    }

    public String getStoredValue() {
        return storedValue;
    }

    public void setStoredValue(String storedValue) {
        this.storedValue = storedValue;
    }

    @Override
    public String toString() {
        return "XSBoolean{" +
                "storedValue='" + storedValue + '\'' +
                '}';
    }
}
