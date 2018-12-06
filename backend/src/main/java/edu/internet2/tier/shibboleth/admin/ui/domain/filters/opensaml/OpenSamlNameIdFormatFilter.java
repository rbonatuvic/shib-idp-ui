package edu.internet2.tier.shibboleth.admin.ui.domain.filters.opensaml;

import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.metadata.resolver.filter.FilterException;
import org.opensaml.saml.metadata.resolver.filter.impl.NameIDFormatFilter;
import org.opensaml.saml.saml2.metadata.EntitiesDescriptor;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;

import javax.annotation.Nullable;

/**
 * Extension to open saml type for workaround forced component initialization check. We need to override <i>filter</i>
 * method to skip this check as we use re-filtering in Shib UI context just to reload effective metadata.
 *
 * @author Dmitriy Kopylenko
 */
public class OpenSamlNameIdFormatFilter extends NameIDFormatFilter {

    @Nullable
    @Override
    public XMLObject filter(@Nullable XMLObject metadata) throws FilterException {
        if (metadata == null) {
            return null;
        }

        if (metadata instanceof EntitiesDescriptor) {
            filterEntitiesDescriptor((EntitiesDescriptor) metadata);
        } else {
            filterEntityDescriptor((EntityDescriptor) metadata);
        }

        return metadata;
    }
}
