package edu.internet2.tier.shibboleth.admin.ui.service;

import com.google.common.base.Predicate;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.opensaml.saml.common.profile.logic.EntityIdPredicate;
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.metadata.resolver.RefreshableMetadataResolver;
import org.opensaml.saml.metadata.resolver.filter.MetadataFilter;
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain;
import org.opensaml.saml.saml2.core.Attribute;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

public class JPAMetadataResolverServiceImpl implements MetadataResolverService {
    private static final Logger logger = LoggerFactory.getLogger(JPAMetadataResolverServiceImpl.class);

    @Autowired
    private MetadataResolver metadataResolver;

    @Autowired
    private MetadataResolverRepository metadataResolverRepository;

    // TODO: enhance
    @Override
    public void reloadFilters(String metadataResolverName) {
        ChainingMetadataResolver chainingMetadataResolver = (ChainingMetadataResolver)metadataResolver;

        MetadataResolver targetMetadataResolver = chainingMetadataResolver.getResolvers().stream().filter(r -> r.getId().equals(metadataResolverName)).findFirst().get();
        edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver jpaMetadataResolver = metadataResolverRepository.findByName(metadataResolverName);

        if (targetMetadataResolver.getMetadataFilter() instanceof MetadataFilterChain) {
            MetadataFilterChain metadataFilterChain = (MetadataFilterChain)targetMetadataResolver.getMetadataFilter();

            List<MetadataFilter> metadataFilters = new ArrayList<>();

            for (edu.internet2.tier.shibboleth.admin.ui.domain.MetadataFilter metadataFilter : jpaMetadataResolver.getMetadataFilters()) {
                if (metadataFilter instanceof EntityAttributesFilter) {
                    EntityAttributesFilter entityAttributesFilter = (EntityAttributesFilter) metadataFilter;

                    org.opensaml.saml.metadata.resolver.filter.impl.EntityAttributesFilter target = new org.opensaml.saml.metadata.resolver.filter.impl.EntityAttributesFilter();
                    Map<Predicate<EntityDescriptor>, Collection<Attribute>> rules = new HashMap<>();
                    if (entityAttributesFilter.getEntityAttributesFilterTarget().getEntityAttributesFilterTargetType() == EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY) {
                        rules.put(
                                new EntityIdPredicate(entityAttributesFilter.getEntityAttributesFilterTarget().getValue()),
                                (List<Attribute>)(List<? extends Attribute>)entityAttributesFilter.getAttributes()
                                );
                    }
                    target.setRules(rules);
                    metadataFilters.add(target);
                }
            }
            metadataFilterChain.setFilters(metadataFilters);
        }

        if (metadataResolver instanceof RefreshableMetadataResolver) {
            try {
                ((RefreshableMetadataResolver)metadataResolver).refresh();
            } catch (ResolverException e) {
                logger.warn("error refreshing metadataResolver " + metadataResolverName, e);
            }
        }
    }
}
