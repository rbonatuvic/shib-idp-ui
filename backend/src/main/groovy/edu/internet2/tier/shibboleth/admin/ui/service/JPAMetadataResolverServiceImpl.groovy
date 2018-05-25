package edu.internet2.tier.shibboleth.admin.ui.service;

import com.google.common.base.Predicate;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import groovy.xml.DOMBuilder
import groovy.xml.MarkupBuilder;
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
import org.w3c.dom.Document;

public class JPAMetadataResolverServiceImpl implements MetadataResolverService {
    private static final Logger logger = LoggerFactory.getLogger(JPAMetadataResolverServiceImpl.class);

    @Autowired
    private MetadataResolver metadataResolver

    @Autowired
    private MetadataResolverRepository metadataResolverRepository

    @Autowired
    private OpenSamlObjects openSamlObjects

    // TODO: enhance
    @Override
    public void reloadFilters(String metadataResolverName) {
        ChainingMetadataResolver chainingMetadataResolver = (ChainingMetadataResolver)metadataResolver;

        // MetadataResolver targetMetadataResolver = chainingMetadataResolver.getResolvers().stream().filter(r -> r.getId().equals(metadataResolverName)).findFirst().get();
        MetadataResolver targetMetadataResolver = chainingMetadataResolver.getResolvers().find { it.id == metadataResolverName }
        edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver jpaMetadataResolver = metadataResolverRepository.findByName(metadataResolverName);

        if (targetMetadataResolver && targetMetadataResolver.getMetadataFilter() instanceof MetadataFilterChain) {
            MetadataFilterChain metadataFilterChain = (MetadataFilterChain)targetMetadataResolver.getMetadataFilter();

            List<MetadataFilter> metadataFilters = new ArrayList<>();

            for (edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter metadataFilter : jpaMetadataResolver.getMetadataFilters()) {
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

    // TODO: enhance
    @Override
    public Document generateConfiguration() {
        // TODO: this can probably be a better writer
        new StringWriter().withCloseable { writer ->
            def xml = new MarkupBuilder(writer)

            xml.MetadataProvider(id: 'ShibbolethMetadata',
                    xmlns: 'urn:mace:shibboleth:2.0:metadata',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:type': 'ChainingMetadataProvider',
                    'xsi:schemaLocation': 'urn:mace:shibboleth:2.0:metadata http://shibboleth.net/schema/idp/shibboleth-metadata.xsd urn:mace:shibboleth:2.0:resource http://shibboleth.net/schema/idp/shibboleth-resource.xsd urn:mace:shibboleth:2.0:security http://shibboleth.net/schema/idp/shibboleth-security.xsd urn:oasis:names:tc:SAML:2.0:metadata http://docs.oasis-open.org/security/saml/v2.0/saml-schema-metadata-2.0.xsd urn:oasis:names:tc:SAML:2.0:assertion http://docs.oasis-open.org/security/saml/v2.0/saml-schema-assertion-2.0.xsd'
            ) {
                metadataResolverRepository.findAll().each { edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver mr ->
                    MetadataProvider(id: 'HTTPMetadata',
                            'xsi:type': 'FileBackedHTTPMetadataProvider',
                            backingFile: '%{idp.home}/metadata/incommonmd.xml',
                            metadataURL: 'http://md.incommon.org/InCommon/InCommon-metadata.xml',
                            minRefreshDelay: 'PT5M',
                            maxRefreshDelay: 'PT1H',
                            refreshDelayFactor: '0.75'
                    ) {
                        MetadataFilter(
                                'xsi:type': 'SignatureValidation',
                                'requireSignedRoot': 'true',
                                'certificateFile': '%{idp.home}/credentials/inc-md-cert.pem'
                        )
                        MetadataFilter(
                                'xsi:type': 'RequiredValidUntil',
                                'maxValidityInterval': 'P14D'
                        )
                        MetadataFilter(
                                'xsi:type': 'EntityRoleWhiteList'
                        ) {
                            RetainedRole('md:SPSSODescriptor')
                        }
                        //TODO: enhance
                        mr.metadataFilters.each { edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter filter ->
                            if (filter instanceof EntityAttributesFilter) {
                                EntityAttributesFilter entityAttributesFilter = (EntityAttributesFilter)filter
                                MetadataFilter('xsi:type': 'EntityAttributes') {
                                    // TODO: enhance. currently this does weird things with namespaces
                                    entityAttributesFilter.attributes.each { attribute ->
                                        mkp.yieldUnescaped(openSamlObjects.marshalToXmlString(attribute, false))
                                    }
                                    if (entityAttributesFilter.entityAttributesFilterTarget.entityAttributesFilterTargetType == EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY) {
                                        entityAttributesFilter.entityAttributesFilterTarget.value.each {
                                            Entity(it)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return DOMBuilder.newInstance().parseText(writer.toString())
        }
    }
}
