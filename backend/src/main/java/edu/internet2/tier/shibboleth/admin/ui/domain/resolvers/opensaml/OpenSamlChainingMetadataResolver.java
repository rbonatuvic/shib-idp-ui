package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import com.google.common.base.Predicates;
import com.google.common.collect.Collections2;
import net.shibboleth.utilities.java.support.annotation.constraint.NonnullElements;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.component.ComponentSupport;
import net.shibboleth.utilities.java.support.resolver.CriteriaSet;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.metadata.resolver.RefreshableMetadataResolver;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlChainingMetadataResolver extends ChainingMetadataResolver {
    @Nonnull private final Logger log = LoggerFactory.getLogger(OpenSamlChainingMetadataResolver.class);

    @Nonnull @NonnullElements private List<MetadataResolver> mutableResolvers;

    public OpenSamlChainingMetadataResolver() {
        this.mutableResolvers = Collections.emptyList();
    }

    public OpenSamlChainingMetadataResolver(@Nonnull List<MetadataResolver> mutableResolvers) {
        this.mutableResolvers = mutableResolvers;
    }

    @Override
    public void setResolvers(@Nonnull @NonnullElements final List<? extends MetadataResolver> newResolvers) {
        if (newResolvers == null || newResolvers.isEmpty()) {
            mutableResolvers = Collections.emptyList();
            return;
        }

        mutableResolvers = new ArrayList<>(Collections2.filter(newResolvers, Predicates.notNull()));
    }

    @Nonnull
    @NonnullElements
    @Override
    public List<MetadataResolver> getResolvers() {
        return mutableResolvers;
    }

    @Override
    @Nonnull public Iterable<EntityDescriptor> resolve(@Nullable final CriteriaSet criteria) throws ResolverException {
        ComponentSupport.ifNotInitializedThrowUninitializedComponentException(this);
        //Our overridden method uses a collection of mutable resolvers instead of regular resolvers
        for (final MetadataResolver resolver : mutableResolvers) {
            try {
                final Iterable<EntityDescriptor> descriptors = resolver.resolve(criteria);
                if (descriptors != null && descriptors.iterator().hasNext()) {
                    return descriptors;
                }
            } catch (final ResolverException e) {
                log.warn("Error retrieving metadata from resolver of type {}, proceeding to next resolver",
                        resolver.getClass().getName(), e);
                continue;
            }
        }

        return Collections.emptyList();
    }

    @Override
    protected void doInitialize() throws ComponentInitializationException {
        super.doInitialize();
        if (mutableResolvers == null) {
            log.warn("OpenSamlChainingMetadataResolver was not configured with any member MetadataResolvers");
            mutableResolvers = Collections.emptyList();
        }
    }

    @Override
    public void refresh() throws ResolverException {
        for (final MetadataResolver resolver : this.mutableResolvers) {
            if (resolver instanceof RefreshableMetadataResolver) {
                ((RefreshableMetadataResolver) resolver).refresh();
            }
        }
    }
}
