package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class Extensions extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.saml2.metadata.Extensions {
    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        return Collections.unmodifiableList(this.getUnknownXMLObjects());
    }

    @Transient
    public Optional<UIInfo> getOptionalUIInfo() {
        List uiinfos = this.getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME);
        if (uiinfos.size() == 0) {
            return Optional.empty();
        } else {
            return Optional.of((UIInfo) uiinfos.get(0));
        }
    }
}
