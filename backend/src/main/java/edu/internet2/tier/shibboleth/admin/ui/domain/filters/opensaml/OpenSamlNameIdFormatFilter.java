package edu.internet2.tier.shibboleth.admin.ui.domain.filters.opensaml;

import net.shibboleth.utilities.java.support.annotation.constraint.NonnullElements;
import net.shibboleth.utilities.java.support.component.ComponentSupport;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.config.XMLObjectProviderRegistrySupport;
import org.opensaml.saml.common.SAMLObjectBuilder;
import org.opensaml.saml.metadata.resolver.filter.FilterException;
import org.opensaml.saml.metadata.resolver.filter.impl.NameIDFormatFilter;
import org.opensaml.saml.saml2.metadata.AttributeAuthorityDescriptor;
import org.opensaml.saml.saml2.metadata.EntitiesDescriptor;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.opensaml.saml.saml2.metadata.NameIDFormat;
import org.opensaml.saml.saml2.metadata.PDPDescriptor;
import org.opensaml.saml.saml2.metadata.RoleDescriptor;
import org.opensaml.saml.saml2.metadata.SPSSODescriptor;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Collection;

/**
 * Extension to open saml type for workaround forced component initialization check. We need to override <i>filter</i>
 * method to skip this check as we use re-filtering in Shib UI context just to reload effective metadata.
 *
 * @author Dmitriy Kopylenko
 */
public class OpenSamlNameIdFormatFilter extends NameIDFormatFilter {

    private boolean removeExistingFormats;

    @Nonnull private final SAMLObjectBuilder<NameIDFormat> formatBuilder;

    public OpenSamlNameIdFormatFilter() {
        formatBuilder = (SAMLObjectBuilder<NameIDFormat>)
                XMLObjectProviderRegistrySupport.getBuilderFactory().<NameIDFormat>getBuilderOrThrow(
                        NameIDFormat.DEFAULT_ELEMENT_NAME);
    }

    @Override
    public void setRemoveExistingFormats(final boolean flag) {
        ComponentSupport.ifInitializedThrowUnmodifiabledComponentException(this);
        removeExistingFormats = flag;
    }

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

    /**Overridden to get rid of log statements which result in NPE in the base class with parent being null**/
    @Override
    protected void filterRoleDescriptor(@Nonnull final RoleDescriptor role,
                                        @Nonnull @NonnullElements final Collection<String> formats) {

        final Collection<NameIDFormat> roleFormats;

        if (role instanceof SPSSODescriptor) {
            roleFormats = ((SPSSODescriptor) role).getNameIDFormats();
        } else if (role instanceof AttributeAuthorityDescriptor) {
            roleFormats = ((AttributeAuthorityDescriptor) role).getNameIDFormats();
        } else if (role instanceof PDPDescriptor) {
            roleFormats = ((PDPDescriptor) role).getNameIDFormats();
        } else {
            return;
        }

        if (removeExistingFormats && !roleFormats.isEmpty()) {
            roleFormats.clear();
        }

        for (final String format : formats) {
            final NameIDFormat nif = formatBuilder.buildObject();
            nif.setFormat(format);
            roleFormats.add(nif);
        }
    }
}
