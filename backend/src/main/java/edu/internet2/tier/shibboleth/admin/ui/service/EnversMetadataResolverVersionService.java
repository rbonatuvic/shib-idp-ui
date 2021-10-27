package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataRequestURLConstructionScheme;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.RegexScheme;
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version;
import edu.internet2.tier.shibboleth.admin.ui.envers.EnversVersionServiceSupport;
import org.springframework.aop.framework.Advised;
import org.springframework.aop.support.AopUtils;

import java.util.List;


/**
 * Hibernate Envers based implementation of {@link MetadataResolverVersionService}.
 */
public class EnversMetadataResolverVersionService implements MetadataResolverVersionService {


    private EnversVersionServiceSupport enversVersionServiceSupport;

    public EnversMetadataResolverVersionService(EnversVersionServiceSupport enversVersionServiceSupport) {
        this.enversVersionServiceSupport = enversVersionServiceSupport;
    }

    @Override
    public List<Version> findVersionsForMetadataResolver(String resourceId) {
        return enversVersionServiceSupport.findVersionsForPersistentEntity(resourceId, MetadataResolver.class);
    }

    @Override
    public MetadataResolver findSpecificVersionOfMetadataResolver(String resourceId, String versionId) {
        Object mrObject = enversVersionServiceSupport.findSpecificVersionOfPersistentEntity(resourceId, versionId, MetadataResolver.class);
        if(mrObject == null) {
            return null;
        }
        MetadataResolver resolver = (MetadataResolver) mrObject;

        //The @PostLoad is not honored by Envers. So need to do this manually for EntityAttributesFilters
        //So the correct representation is built and returned to upstream clients expecting JSON
        resolver.entityAttributesFilterIntoTransientRepresentation();
        if (resolver instanceof DynamicHttpMetadataResolver) {
            MetadataRequestURLConstructionScheme scheme = ((DynamicHttpMetadataResolver)resolver).getMetadataRequestURLConstructionScheme();
            RegexScheme rs = null;
            try {
                rs = getTargetObject(scheme, RegexScheme.class);
                ((DynamicHttpMetadataResolver)resolver).setMetadataRequestURLConstructionScheme(rs);
            }
            catch (Exception e) {
            }
        }

        return resolver;
    }

    @SuppressWarnings({"unchecked"})
    protected <T> T getTargetObject(Object proxy, Class<T> targetClass) throws Exception {
        if (AopUtils.isJdkDynamicProxy(proxy)) {
            return (T) ((Advised)proxy).getTargetSource().getTarget();
        } else {
            return (T) proxy; // expected to be cglib proxy then, which is simply a specialized class
        }
    }
}