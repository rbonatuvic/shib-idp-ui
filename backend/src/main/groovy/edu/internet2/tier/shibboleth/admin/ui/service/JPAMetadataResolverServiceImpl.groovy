package edu.internet2.tier.shibboleth.admin.ui.service

import com.google.common.base.Predicate
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.NameIdFormatFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.SignatureValidationFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.opensaml.OpenSamlNameIdFormatFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataRequestURLConstructionScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.RegexScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.TemplateScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.Refilterable
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import groovy.util.logging.Slf4j
import groovy.xml.DOMBuilder
import groovy.xml.MarkupBuilder
import net.shibboleth.utilities.java.support.scripting.EvaluableScript
import org.opensaml.saml.common.profile.logic.EntityIdPredicate
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.filter.MetadataFilter
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain
import org.opensaml.saml.metadata.resolver.filter.impl.NameIDFormatFilter
import org.opensaml.saml.saml2.core.Attribute
import org.opensaml.saml.saml2.metadata.EntityDescriptor
import org.springframework.beans.factory.annotation.Autowired
import org.w3c.dom.Document

import javax.annotation.Nonnull

import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.NameIdFormatFilterTarget.NameIdFormatFilterTargetType.ENTITY
import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.NameIdFormatFilterTarget.NameIdFormatFilterTargetType.CONDITION_SCRIPT
import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.NameIdFormatFilterTarget.NameIdFormatFilterTargetType.REGEX
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver.ResourceType.CLASSPATH
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver.ResourceType.SVN

@Slf4j
class JPAMetadataResolverServiceImpl implements MetadataResolverService {

    @Autowired
    private MetadataResolver metadataResolver

    @Autowired
    private MetadataResolverRepository metadataResolverRepository

    @Autowired
    private OpenSamlObjects openSamlObjects

    @Autowired
    private MetadataResolversPositionOrderContainerService resolversPositionOrderContainerService

    @Autowired
    private ShibUIConfiguration shibUIConfiguration

    // TODO: enhance
    @Override
    void reloadFilters(String metadataResolverResourceId) {
        OpenSamlChainingMetadataResolver chainingMetadataResolver = (OpenSamlChainingMetadataResolver) metadataResolver
        MetadataResolver targetMetadataResolver = chainingMetadataResolver.getResolvers().find {
            it.id == metadataResolverResourceId
        }
        edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver jpaMetadataResolver = metadataResolverRepository.findByResourceId(metadataResolverResourceId)

        if (targetMetadataResolver && targetMetadataResolver.getMetadataFilter() instanceof MetadataFilterChain) {
            MetadataFilterChain metadataFilterChain = (MetadataFilterChain) targetMetadataResolver.getMetadataFilter()

            List<MetadataFilter> metadataFilters = new ArrayList<>()

            // set up namespace protection
            if (shibUIConfiguration.protectedAttributeNamespaces && shibUIConfiguration.protectedAttributeNamespaces.size() > 0) {
                def target = new org.opensaml.saml.metadata.resolver.filter.impl.EntityAttributesFilter()
                target.attributeFilter = new ScriptedPredicate(new EvaluableScript(protectedNamespaceScript()))
                metadataFilters.add(target)
            }

            for (edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter metadataFilter : jpaMetadataResolver.getMetadataFilters()) {
                if (metadataFilter instanceof EntityAttributesFilter) {
                    EntityAttributesFilter entityAttributesFilter = (EntityAttributesFilter) metadataFilter

                    org.opensaml.saml.metadata.resolver.filter.impl.EntityAttributesFilter target = new org.opensaml.saml.metadata.resolver.filter.impl.EntityAttributesFilter()
                    Map<Predicate<EntityDescriptor>, Collection<Attribute>> rules = new HashMap<>()
                    switch (entityAttributesFilter.getEntityAttributesFilterTarget().getEntityAttributesFilterTargetType()) {
                        case EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY:
                            rules.put(
                                    new EntityIdPredicate(entityAttributesFilter.getEntityAttributesFilterTarget().getValue()),
                                    (List<Attribute>) (List<? extends Attribute>) entityAttributesFilter.getAttributes()
                            )
                            break
                        case EntityAttributesFilterTarget.EntityAttributesFilterTargetType.CONDITION_SCRIPT:
                            rules.put(new ScriptedPredicate(new EvaluableScript(entityAttributesFilter.entityAttributesFilterTarget.value[0])),
                                    (List<Attribute>) (List<? extends Attribute>) entityAttributesFilter.getAttributes())
                            break
                        case EntityAttributesFilterTarget.EntityAttributesFilterTargetType.REGEX:
                            rules.put(new ScriptedPredicate(new EvaluableScript(generateJavaScriptRegexScript(entityAttributesFilter.entityAttributesFilterTarget.value[0]))),
                                    (List<Attribute>) (List<? extends Attribute>) entityAttributesFilter.getAttributes())
                            break
                        default:
                            // do nothing, we'd have exploded elsewhere previously.
                            break
                    }
                    target.setRules(rules)
                    metadataFilters.add(target)
                }
                if (metadataFilter instanceof NameIdFormatFilter) {
                    NameIdFormatFilter nameIdFormatFilter = NameIdFormatFilter.cast(metadataFilter)
                    NameIDFormatFilter openSamlTargetFilter = new OpenSamlNameIdFormatFilter()
                    openSamlTargetFilter.removeExistingFormats = nameIdFormatFilter.removeExistingFormats
                    Map<Predicate<EntityDescriptor>, Collection<String>> predicateRules = [:]
                    def type = nameIdFormatFilter.nameIdFormatFilterTarget.nameIdFormatFilterTargetType
                    def values = nameIdFormatFilter.nameIdFormatFilterTarget.value
                    switch (type) {
                        case ENTITY:
                            predicateRules[new EntityIdPredicate(values)] = nameIdFormatFilter.formats
                            break
                        case CONDITION_SCRIPT:
                            predicateRules[new ScriptedPredicate(new EvaluableScript(values[0]))] = nameIdFormatFilter.formats
                            break
                        case REGEX:
                            predicateRules[new ScriptedPredicate(new EvaluableScript(generateJavaScriptRegexScript(values[0])))] = nameIdFormatFilter.formats
                            break
                        default:
                            // do nothing, we'd have exploded elsewhere previously.
                            break
                    }
                    openSamlTargetFilter.rules = predicateRules
                    metadataFilters << openSamlTargetFilter
                }
            }
            metadataFilterChain.setFilters(metadataFilters)
        }

        if (targetMetadataResolver != null && targetMetadataResolver instanceof Refilterable) {
            (Refilterable) targetMetadataResolver.refilter()
        } else {
            //TODO: Do something here if we need to refilter other non-Batch resolvers
            log.warn("Target resolver is not a Refilterable resolver. Skipping refilter()")
        }
    }

    private String protectedNamespaceScript() {
        return """(function (attribute) {
                "use strict";
                var namespaces = [${shibUIConfiguration.protectedAttributeNamespaces.collect({"\"${it}\""}).join(', ')}];
                // check the parameter
                if (attribute === null) { return true; }
                for (var i in namespaces) {
                    if (attribute.getName().startsWith(namespaces[i])) {
                        return false;
                    }
                }
                return true;
            }(input));"""
    }

    private class ScriptedPredicate extends net.shibboleth.utilities.java.support.logic.ScriptedPredicate<EntityDescriptor> {
        protected ScriptedPredicate(@Nonnull EvaluableScript theScript) {
            super(theScript)
        }
    }

    // TODO: enhance
    @Override
    Document generateConfiguration() {
        // TODO: this can probably be a better writer
        new StringWriter().withCloseable { writer ->
            def xml = new MarkupBuilder(writer)
            xml.omitEmptyAttributes = true
            xml.omitNullAttributes = true

            xml.MetadataProvider(id: 'ShibbolethMetadata',
                    xmlns: 'urn:mace:shibboleth:2.0:metadata',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:type': 'ChainingMetadataProvider',
                    'xsi:schemaLocation': 'urn:mace:shibboleth:2.0:metadata http://shibboleth.net/schema/idp/shibboleth-metadata.xsd urn:mace:shibboleth:2.0:resource http://shibboleth.net/schema/idp/shibboleth-resource.xsd urn:mace:shibboleth:2.0:security http://shibboleth.net/schema/idp/shibboleth-security.xsd urn:oasis:names:tc:SAML:2.0:metadata http://docs.oasis-open.org/security/saml/v2.0/saml-schema-metadata-2.0.xsd urn:oasis:names:tc:SAML:2.0:assertion http://docs.oasis-open.org/security/saml/v2.0/saml-schema-assertion-2.0.xsd'
            ) {


                resolversPositionOrderContainerService.allMetadataResolversInDefinedOrderOrUnordered.each {
                    edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver mr ->
                        //TODO: We do not currently marshall the internal incommon chaining resolver (with BaseMetadataResolver type)
                        if ((mr.type != 'BaseMetadataResolver') && (mr.enabled)) {
                            constructXmlNodeForResolver(mr, delegate) {
                                //TODO: enhance
                                def didNamespaceProtectionFilter = !(shibUIConfiguration.protectedAttributeNamespaces && shibUIConfiguration.protectedAttributeNamespaces.size() > 0)
                                mr.metadataFilters.each { edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter filter ->
                                    if (filter instanceof EntityAttributesFilter && !didNamespaceProtectionFilter) {
                                        constructXmlNodeForEntityAttributeNamespaceProtection(delegate)
                                        didNamespaceProtectionFilter = true
                                    }
                                    constructXmlNodeForFilter(filter, delegate)
                                }
                                if (!didNamespaceProtectionFilter) {
                                    constructXmlNodeForEntityAttributeNamespaceProtection(delegate)
                                    didNamespaceProtectionFilter = true
                                }
                            }
                        }
                }
            }
            return DOMBuilder.newInstance().parseText(writer.toString())
        }
    }

    void constructXmlNodeForEntityAttributeNamespaceProtection(def markupBuilderDelegate) {
        markupBuilderDelegate.MetadataFilter('xsi:type': 'EntityAttributes') {
            AttributeFilterScript() {
                Script() {
                    mkp.yieldUnescaped("\n<![CDATA[\n${protectedNamespaceScript()}\n]]>\n")
                }
            }
        }
    }

    void constructXmlNodeForFilter(SignatureValidationFilter filter, def markupBuilderDelegate) {
        if (filter.xmlShouldBeGenerated()) {
            markupBuilderDelegate.MetadataFilter(id: filter.name,
                    'xsi:type': 'SignatureValidation',
                    'xmlns:md': 'urn:oasis:names:tc:SAML:2.0:metadata',
                    'requireSignedRoot': !filter.requireSignedRoot ?: null,
                    'certificateFile': filter.certificateFile,
                    'defaultCriteriaRef': filter.defaultCriteriaRef,
                    'signaturePrevalidatorRef': filter.signaturePrevalidatorRef,
                    'dynamicTrustedNamesStrategyRef': filter.dynamicTrustedNamesStrategyRef,
                    'trustEngineRef': filter.trustEngineRef,
                    'publicKey': filter.publicKey)
        }
    }

    void constructXmlNodeForFilter(EntityAttributesFilter filter, def markupBuilderDelegate) {
        markupBuilderDelegate.MetadataFilter('xsi:type': 'EntityAttributes') {
            // TODO: enhance. currently this does weird things with namespaces
            filter.attributes.each { attribute ->
                mkp.yieldUnescaped(openSamlObjects.marshalToXmlString(attribute, false))
            }
            switch (filter.entityAttributesFilterTarget.entityAttributesFilterTargetType) {
                case EntityAttributesFilterTarget
                        .EntityAttributesFilterTargetType.ENTITY:
                    filter.entityAttributesFilterTarget.value.each {
                        Entity(it)
                    }
                    break
                case EntityAttributesFilterTarget
                        .EntityAttributesFilterTargetType.CONDITION_SCRIPT:
                case EntityAttributesFilterTarget
                        .EntityAttributesFilterTargetType.REGEX:
                    ConditionScript() {
                        Script() {
                            def script
                            if (filter.entityAttributesFilterTarget.entityAttributesFilterTargetType ==
                                    EntityAttributesFilterTarget.EntityAttributesFilterTargetType.CONDITION_SCRIPT) {
                                script = filter.entityAttributesFilterTarget.value[0]
                            } else if (filter.entityAttributesFilterTarget.entityAttributesFilterTargetType ==
                                    EntityAttributesFilterTarget.EntityAttributesFilterTargetType.REGEX) {
                                script = generateJavaScriptRegexScript(filter.entityAttributesFilterTarget.value[0])
                            }
                            mkp.yieldUnescaped("\n<![CDATA[\n${script}\n]]>\n")
                        }
                    }
                    break
                default:
                    // do nothing, we'd have exploded elsewhere previously.
                    break
            }
        }
    }

    private String generateJavaScriptRegexScript(String regex) {
        return """
    "use strict";
    ${regex}.test(input.getEntityID());\n"""
    }

    void constructXmlNodeForFilter(EntityRoleWhiteListFilter filter, def markupBuilderDelegate) {
        markupBuilderDelegate.MetadataFilter(
                'xsi:type': 'EntityRoleWhiteList',
                'xmlns:md': 'urn:oasis:names:tc:SAML:2.0:metadata'
        ) {
            filter.retainedRoles.each {
                // TODO: fix
                markupBuilderDelegate.RetainedRole(it.startsWith('md:') ? it : "md:${it}")
            }
        }
    }

    void constructXmlNodeForFilter(RequiredValidUntilFilter filter, def markupBuilderDelegate) {
        if (filter.xmlShouldBeGenerated()) {
            markupBuilderDelegate.MetadataFilter(
                    'xsi:type': 'RequiredValidUntil',
                    maxValidityInterval: filter.maxValidityInterval
            )
        }
    }

    void constructXmlNodeForFilter(NameIdFormatFilter filter, def markupBuilderDelegate) {
        def type = filter.nameIdFormatFilterTarget.nameIdFormatFilterTargetType
        markupBuilderDelegate.MetadataFilter(
                'xsi:type': 'NameIDFormat',
                'xmlns:md': 'urn:oasis:names:tc:SAML:2.0:metadata',
                'removeExistingFormats': filter.removeExistingFormats ?: null
        ) {
            filter.formats.each {
                Format(it)
            }
            switch (type) {
                case ENTITY:
                    filter.nameIdFormatFilterTarget.value.each {
                        Entity(it)
                    }
                    break
                case CONDITION_SCRIPT:
                case REGEX:
                    ConditionScript() {
                        Script() {
                            def script
                            def scriptValue = filter.nameIdFormatFilterTarget.value[0]
                            if (type == CONDITION_SCRIPT) {
                                script = scriptValue
                            } else if (type == REGEX) {
                                script = generateJavaScriptRegexScript(scriptValue)
                            }
                            mkp.yieldUnescaped("\n<![CDATA[\n${script}\n]]>\n")
                        }
                    }
                    break
                default:
                    // do nothing, we'd have exploded elsewhere previously.
                    break
            }
        }
    }

    void constructXmlNodeForResolver(FilesystemMetadataResolver resolver, def markupBuilderDelegate, Closure childNodes) {
        markupBuilderDelegate.MetadataProvider(id: resolver.xmlId,
                'xsi:type': 'FilesystemMetadataProvider',
                metadataFile: resolver.metadataFile,

                requireValidMetadata: !resolver.requireValidMetadata ?: null,
                failFastInitialization: !resolver.failFastInitialization ?: null,
                sortKey: resolver.sortKey,
                criterionPredicateRegistryRef: resolver.criterionPredicateRegistryRef,
                useDefaultPredicateRegistry: !resolver.useDefaultPredicateRegistry ?: null,
                satisfyAnyPredicates: resolver.satisfyAnyPredicates ?: null,

                parserPoolRef: resolver.reloadableMetadataResolverAttributes?.parserPoolRef,
                minRefreshDelay: resolver.reloadableMetadataResolverAttributes?.minRefreshDelay,
                maxRefreshDelay: resolver.reloadableMetadataResolverAttributes?.maxRefreshDelay,
                refreshDelayFactor: resolver.reloadableMetadataResolverAttributes?.refreshDelayFactor,
                indexesRef: resolver.reloadableMetadataResolverAttributes?.indexesRef,
                resolveViaPredicatesOnly: resolver.reloadableMetadataResolverAttributes?.resolveViaPredicatesOnly ?: null,
                expirationWarningThreshold: resolver.reloadableMetadataResolverAttributes?.expirationWarningThreshold) {

            childNodes()
        }
    }

    void constructXmlNodeForResolver(DynamicHttpMetadataResolver resolver, def markupBuilderDelegate, Closure childNodes) {
        markupBuilderDelegate.MetadataProvider(id: resolver.xmlId,
                'xsi:type': 'DynamicHttpMetadataProvider',
                requireValidMetadata: !resolver.requireValidMetadata ?: null,
                failFastInitialization: !resolver.failFastInitialization ?: null,
                sortKey: resolver.sortKey,
                criterionPredicateRegistryRef: resolver.criterionPredicateRegistryRef,
                useDefaultPredicateRegistry: !resolver.useDefaultPredicateRegistry ?: null,
                satisfyAnyPredicates: resolver.satisfyAnyPredicates ?: null,
                parserPoolRef: resolver.dynamicMetadataResolverAttributes?.parserPoolRef,
                taskTimerRef: resolver.dynamicMetadataResolverAttributes?.taskTimerRef,
                refreshDelayFactor: resolver.dynamicMetadataResolverAttributes?.refreshDelayFactor,
                minCacheDuration: resolver.dynamicMetadataResolverAttributes?.minCacheDuration,
                maxCacheDuration: resolver.dynamicMetadataResolverAttributes?.maxCacheDuration,
                maxIdleEntityData: resolver.dynamicMetadataResolverAttributes?.maxIdleEntityData,
                removeIdleEntityData: !resolver.dynamicMetadataResolverAttributes?.removeIdleEntityData ?: null,
                cleanupTaskInterval: resolver.dynamicMetadataResolverAttributes?.cleanupTaskInterval,
                persistentCacheManagerRef: resolver.dynamicMetadataResolverAttributes?.persistentCacheManagerRef,
                persistentCacheManagerDirectory: resolver.dynamicMetadataResolverAttributes?.persistentCacheManagerDirectory,
                persistentCacheKeyGeneratorRef: resolver.dynamicMetadataResolverAttributes?.persistentCacheKeyGeneratorRef,
                initializeFromPersistentCacheInBackground: !resolver.dynamicMetadataResolverAttributes?.initializeFromPersistentCacheInBackground ?: null,
                backgroundInitializationFromCacheDelay: resolver.dynamicMetadataResolverAttributes?.backgroundInitializationFromCacheDelay,
                initializationFromCachePredicateRef: resolver.dynamicMetadataResolverAttributes?.initializationFromCachePredicateRef,

                maxConnectionsTotal: resolver.maxConnectionsTotal,
                maxConnectionsPerRoute: resolver.maxConnectionsPerRoute,
                supportedContentTypes: resolver.supportedContentTypes?.value, //not sure this is right. maybe take off the ?.value

                httpClientRef: resolver.httpMetadataResolverAttributes?.httpClientRef,
                connectionRequestTimeout: resolver.httpMetadataResolverAttributes?.connectionRequestTimeout,
                connectionTimeout: resolver.httpMetadataResolverAttributes?.connectionTimeout,
                socketTimeout: resolver.httpMetadataResolverAttributes?.socketTimeout,
                disregardTLSCertificate: resolver.httpMetadataResolverAttributes?.disregardTLSCertificate ?: null,
                httpClientSecurityParametersRef: resolver.httpMetadataResolverAttributes?.httpClientSecurityParametersRef,
                proxyHost: resolver.httpMetadataResolverAttributes?.proxyHost,
                proxyPort: resolver.httpMetadataResolverAttributes?.proxyHost,
                proxyUser: resolver.httpMetadataResolverAttributes?.proxyUser,
                proxyPassword: resolver.httpMetadataResolverAttributes?.proxyPassword,
                httpCaching: resolver.httpMetadataResolverAttributes?.httpCaching,
                httpCacheDirectory: resolver.httpMetadataResolverAttributes?.httpCacheDirectory,
                httpMaxCacheEntries: resolver.httpMetadataResolverAttributes?.httpMaxCacheEntries,
                httpMaxCacheEntrySize: resolver.httpMetadataResolverAttributes?.httpMaxCacheEntrySize) {

            switch (MetadataRequestURLConstructionScheme.SchemeType.get(resolver.metadataRequestURLConstructionScheme.type)) {
                case MetadataRequestURLConstructionScheme.SchemeType.METADATA_QUERY_PROTOCOL:
                    MetadataQueryProtocolScheme scheme = (MetadataQueryProtocolScheme) resolver.metadataRequestURLConstructionScheme
                    MetadataQueryProtocol(transformRef: scheme.transformRef) {
                        if (scheme.content != null) {
                            mkp.yield(scheme.content)
                        }
                    }
                    break
                case MetadataRequestURLConstructionScheme.SchemeType.TEMPLATE:
                    TemplateScheme scheme = (TemplateScheme) resolver.metadataRequestURLConstructionScheme
                    Template(encodingStyle: scheme.encodingStyle,
                            transformRef: scheme.transformRef,
                            velocityEngine: scheme.velocityEngine) {
                        if (scheme.content != null) {
                            mkp.yield(scheme.content)
                        }
                    }
                    break
                case MetadataRequestURLConstructionScheme.SchemeType.REGEX:
                    RegexScheme scheme = (RegexScheme) resolver.metadataRequestURLConstructionScheme
                    Regex(match: scheme.match) {
                        if (scheme.content != null) {
                            mkp.yield(scheme.content)
                        }
                    }
                    break
                default:
                    break
            }
            childNodes()
        }
    }

    void constructXmlNodeForResolver(FileBackedHttpMetadataResolver resolver, def markupBuilderDelegate, Closure childNodes) {
        markupBuilderDelegate.MetadataProvider(id: resolver.xmlId,
                'xsi:type': 'FileBackedHTTPMetadataProvider',
                backingFile: resolver.backingFile,
                metadataURL: resolver.metadataURL,
                initializeFromBackupFile: !resolver.initializeFromBackupFile ?: null,
                backupFileInitNextRefreshDelay: resolver.backupFileInitNextRefreshDelay,
                requireValidMetadata: !resolver.requireValidMetadata ?: null,
                failFastInitialization: !resolver.failFastInitialization ?: null,
                sortKey: resolver.sortKey,
                criterionPredicateRegistryRef: resolver.criterionPredicateRegistryRef,
                useDefaultPredicateRegistry: !resolver.useDefaultPredicateRegistry ?: null,
                satisfyAnyPredicates: resolver.satisfyAnyPredicates ?: null,

                parserPoolRef: resolver.reloadableMetadataResolverAttributes?.parserPoolRef,
                minRefreshDelay: resolver.reloadableMetadataResolverAttributes?.minRefreshDelay,
                maxRefreshDelay: resolver.reloadableMetadataResolverAttributes?.maxRefreshDelay,
                refreshDelayFactor: resolver.reloadableMetadataResolverAttributes?.refreshDelayFactor,
                indexesRef: resolver.reloadableMetadataResolverAttributes?.indexesRef,
                resolveViaPredicatesOnly: resolver.reloadableMetadataResolverAttributes?.resolveViaPredicatesOnly ?: null,
                expirationWarningThreshold: resolver.reloadableMetadataResolverAttributes?.expirationWarningThreshold,

                httpClientRef: resolver.httpMetadataResolverAttributes?.httpClientRef,
                connectionRequestTimeout: resolver.httpMetadataResolverAttributes?.connectionRequestTimeout,
                connectionTimeout: resolver.httpMetadataResolverAttributes?.connectionTimeout,
                socketTimeout: resolver.httpMetadataResolverAttributes?.socketTimeout,
                disregardTLSCertificate: resolver.httpMetadataResolverAttributes?.disregardTLSCertificate ?: null,
                httpClientSecurityParametersRef: resolver.httpMetadataResolverAttributes?.httpClientSecurityParametersRef,
                proxyHost: resolver.httpMetadataResolverAttributes?.proxyHost,
                proxyPort: resolver.httpMetadataResolverAttributes?.proxyHost,
                proxyUser: resolver.httpMetadataResolverAttributes?.proxyUser,
                proxyPassword: resolver.httpMetadataResolverAttributes?.proxyPassword,
                httpCaching: resolver.httpMetadataResolverAttributes?.httpCaching,
                httpCacheDirectory: resolver.httpMetadataResolverAttributes?.httpCacheDirectory,
                httpMaxCacheEntries: resolver.httpMetadataResolverAttributes?.httpMaxCacheEntries,
                httpMaxCacheEntrySize: resolver.httpMetadataResolverAttributes?.httpMaxCacheEntrySize) {

            childNodes()
        }
    }

    void constructXmlNodeForResolver(LocalDynamicMetadataResolver resolver, def markupBuilderDelegate, Closure childNodes) {
        markupBuilderDelegate.MetadataProvider(sourceDirectory: resolver.sourceDirectory,
                sourceManagerRef: resolver.sourceManagerRef,
                sourceKeyGeneratorRef: resolver.sourceKeyGeneratorRef,

                id: resolver.xmlId,
                'xsi:type': 'DynamicHttpMetadataProvider',
                requireValidMetadata: !resolver.requireValidMetadata ?: null,
                failFastInitialization: !resolver.failFastInitialization ?: null,
                sortKey: resolver.sortKey,
                criterionPredicateRegistryRef: resolver.criterionPredicateRegistryRef,
                useDefaultPredicateRegistry: !resolver.useDefaultPredicateRegistry ?: null,
                satisfyAnyPredicates: resolver.satisfyAnyPredicates ?: null,
                parserPoolRef: resolver.dynamicMetadataResolverAttributes?.parserPoolRef,
                taskTimerRef: resolver.dynamicMetadataResolverAttributes?.taskTimerRef,
                refreshDelayFactor: resolver.dynamicMetadataResolverAttributes?.refreshDelayFactor,
                minCacheDuration: resolver.dynamicMetadataResolverAttributes?.minCacheDuration,
                maxCacheDuration: resolver.dynamicMetadataResolverAttributes?.maxCacheDuration,
                maxIdleEntityData: resolver.dynamicMetadataResolverAttributes?.maxIdleEntityData,
                removeIdleEntityData: !resolver.dynamicMetadataResolverAttributes?.removeIdleEntityData ?: null,
                cleanupTaskInterval: resolver.dynamicMetadataResolverAttributes?.cleanupTaskInterval,
                persistentCacheManagerRef: resolver.dynamicMetadataResolverAttributes?.persistentCacheManagerRef,
                persistentCacheManagerDirectory: resolver.dynamicMetadataResolverAttributes?.persistentCacheManagerDirectory,
                persistentCacheKeyGeneratorRef: resolver.dynamicMetadataResolverAttributes?.persistentCacheKeyGeneratorRef,
                initializeFromPersistentCacheInBackground: !resolver.dynamicMetadataResolverAttributes?.initializeFromPersistentCacheInBackground ?: null,
                backgroundInitializationFromCacheDelay: resolver.dynamicMetadataResolverAttributes?.backgroundInitializationFromCacheDelay,
                initializationFromCachePredicateRef: resolver.dynamicMetadataResolverAttributes?.initializationFromCachePredicateRef) {

            childNodes()
        }
    }

    void constructXmlNodeForResolver(ResourceBackedMetadataResolver resolver, def markupBuilderDelegate, Closure childNodes) {
        //This might throw an InvalidResourceTypeException if both resource types do not satisfy validation rules
        //But this validation step already would have been performed by higher app layers such as REST controllers,
        //and if this is not done, an exception thrown here would be trully considered a server side error bug which would
        //need to be taken care of
        def resourceType = resolver.validateAndDetermineResourceType()

        markupBuilderDelegate.MetadataProvider(
                id: resolver.xmlId,
                'xsi:type': 'ResourceBackedMetadataProvider',
                parserPoolRef: resolver.reloadableMetadataResolverAttributes?.parserPoolRef,
                minRefreshDelay: resolver.reloadableMetadataResolverAttributes?.minRefreshDelay,
                maxRefreshDelay: resolver.reloadableMetadataResolverAttributes?.maxRefreshDelay,
                refreshDelayFactor: resolver.reloadableMetadataResolverAttributes?.refreshDelayFactor,
                indexesRef: resolver.reloadableMetadataResolverAttributes?.indexesRef,
                resolveViaPredicatesOnly: resolver.reloadableMetadataResolverAttributes?.resolveViaPredicatesOnly ?: null,
                expirationWarningThreshold: resolver.reloadableMetadataResolverAttributes?.expirationWarningThreshold) {

            if (resourceType == SVN) {
                MetadataResource(
                        'xmlns:resource': 'urn:mace:shibboleth:2.0:resource',
                        'xsi:type': 'resource:SVNResource',
                        'resourceFile': resolver.svnMetadataResource.resourceFile,
                        'repositoryURL': resolver.svnMetadataResource.repositoryURL,
                        'workingCopyDirectory': resolver.svnMetadataResource.workingCopyDirectory,
                        'username': resolver.svnMetadataResource.username,
                        'password': resolver.svnMetadataResource.password,
                        'proxyHost': resolver.svnMetadataResource.proxyHost,
                        'proxyPort': resolver.svnMetadataResource.proxyHost,
                        'proxyUserName': resolver.svnMetadataResource.proxyUserName,
                        'proxyPassword': resolver.svnMetadataResource.proxyPassword)

            } else if (resourceType == CLASSPATH) {
                MetadataResource(
                        'xmlns:resource': 'urn:mace:shibboleth:2.0:resource',
                        'xsi:type': 'resource:ClasspathResource',
                        'file': resolver.classpathMetadataResource.file)
            }

            childNodes()
        }

    }

}