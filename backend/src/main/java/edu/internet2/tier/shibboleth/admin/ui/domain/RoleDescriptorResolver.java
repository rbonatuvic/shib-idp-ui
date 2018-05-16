package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import net.shibboleth.utilities.java.support.resolver.CriteriaSet;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.opensaml.saml.saml2.metadata.RoleDescriptor;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class RoleDescriptorResolver extends AbstractAuditable implements org.opensaml.saml.metadata.resolver.RoleDescriptorResolver {
    private String localId;

    private boolean isRequireValidMetadata;

    @Override
    public String getId() {
        return this.localId;
    }

    public void setID(String id) {
        this.localId = id;
    }

    @Override
    public boolean isRequireValidMetadata() {
        return isRequireValidMetadata;
    }

    @Override
    public void setRequireValidMetadata(boolean isRequireValidMetadata) {
        this.isRequireValidMetadata = isRequireValidMetadata;
    }

    @Nonnull
    @Override
    public Iterable<RoleDescriptor> resolve(@Nullable CriteriaSet criteria) throws ResolverException {
        return null; //TODO pull role descriptors from db based on criteria?
    }

    @Nullable
    @Override
    public RoleDescriptor resolveSingle(@Nullable CriteriaSet criteria) throws ResolverException {
        return null; //TODO pull role descriptor from db based on criteria?
    }
}
