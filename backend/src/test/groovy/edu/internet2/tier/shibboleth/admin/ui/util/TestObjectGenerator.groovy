package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.*
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.*
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget.EntityAttributesFilterTargetType
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterTargetRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.*
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import org.opensaml.saml.saml2.metadata.Organization

import java.nio.file.Files
import java.util.function.Supplier

import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.NameIdFormatFilterTarget.NameIdFormatFilterTargetType.ENTITY

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class TestObjectGenerator {

    AttributeUtility attributeUtility

    CustomPropertiesConfiguration customPropertiesConfiguration

    RandomGenerator generator = new RandomGenerator()

    TestObjectGenerator() {}

    TestObjectGenerator(AttributeUtility attributeUtility) {
        this.attributeUtility = attributeUtility
    }

    TestObjectGenerator(AttributeUtility attributeUtility, CustomPropertiesConfiguration customPropertiesConfiguration) {
        this.attributeUtility = attributeUtility
        this.customPropertiesConfiguration = customPropertiesConfiguration
    }

    DynamicHttpMetadataResolver buildDynamicHttpMetadataResolver() {
        def resolver = new DynamicHttpMetadataResolver().with {
            it.dynamicMetadataResolverAttributes = buildDynamicMetadataResolverAttributes()
            it.httpMetadataResolverAttributes = buildHttpMetadataResolverAttributes()
            it.maxConnectionsPerRoute = generator.randomInt(1, 100)
            it.maxConnectionsTotal = generator.randomInt(1, 100)
            it.supportedContentTypes = generator.randomStringList()
            it.name = generator.randomString(10)
            it.requireValidMetadata = generator.randomBoolean()
            it.failFastInitialization = generator.randomBoolean()
            it.sortKey = generator.randomInt(1, 10)
            it.criterionPredicateRegistryRef = generator.randomString(10)
            it.useDefaultPredicateRegistry = generator.randomBoolean()
            it.satisfyAnyPredicates = generator.randomBoolean()
            it.metadataFilters = buildAllTypesOfFilterList()
            it
        }
        return resolver
    }

    HttpMetadataResolverAttributes buildHttpMetadataResolverAttributes() {
        def attributes = new HttpMetadataResolverAttributes().with {
            it.disregardTLSCertificate = generator.randomBoolean()
            it.connectionRequestTimeout = generator.randomString(10)
            it.httpClientRef = generator.randomString(10)
            it.httpCacheDirectory = generator.randomString(10)
            it.httpCaching = randomHttpCachingType()
            it.httpClientSecurityParametersRef = generator.randomString(10)
            it.httpMaxCacheEntries = generator.randomInt(1, 10)
            it.httpMaxCacheEntrySize = generator.randomInt(100, 10000)
            it.proxyHost = generator.randomString(10)
            it.proxyPassword = generator.randomString(10)
            it.proxyPort = generator.randomString(5)
            it.proxyUser = generator.randomString(10)
            it.socketTimeout = generator.randomString(10)
            it.tlsTrustEngineRef = generator.randomString(10)
            it.connectionTimeout = generator.randomString(10)
            it
        }
        return attributes
    }

    HttpMetadataResolverAttributes.HttpCachingType randomHttpCachingType() {
        HttpMetadataResolverAttributes.HttpCachingType.values()[generator.randomInt(0, 2)]
    }

    LocalDynamicMetadataResolver buildLocalDynamicMetadataResolver() {
        def resolver = new LocalDynamicMetadataResolver().with {
            it.dynamicMetadataResolverAttributes = buildDynamicMetadataResolverAttributes()
            it.sourceDirectory = generator.randomString(10)
            it.sourceKeyGeneratorRef = generator.randomString(10)
            it.sourceManagerRef = generator.randomString(10)
            it.failFastInitialization = generator.randomBoolean()
            it.name = generator.randomString(10)
            it.requireValidMetadata = generator.randomBoolean()
            it.useDefaultPredicateRegistry = generator.randomBoolean()
            it.criterionPredicateRegistryRef = generator.randomString(10)
            it.satisfyAnyPredicates = generator.randomBoolean()
            it.sortKey = generator.randomInt(1, 10)
            it.metadataFilters = buildAllTypesOfFilterList()
            it
        }
        return resolver
    }

    DynamicMetadataResolverAttributes buildDynamicMetadataResolverAttributes() {
        def attributes = new DynamicMetadataResolverAttributes().with {
            it.backgroundInitializationFromCacheDelay = generator.randomString(10)
            it.cleanupTaskInterval = generator.randomString(10)
            it.initializationFromCachePredicateRef = generator.randomString(10)
            it.initializeFromPersistentCacheInBackground = generator.randomBoolean()
            it.maxCacheDuration = generator.randomString(5)
            it.maxIdleEntityData = generator.randomString(5)
            it.minCacheDuration = generator.randomString(5)
            it.parserPoolRef = generator.randomString(10)
            it.persistentCacheKeyGeneratorRef = generator.randomString(10)
            it.persistentCacheManagerDirectory = generator.randomString(10)
            it.persistentCacheManagerRef = generator.randomString(10)
            it.refreshDelayFactor = generator.randomInt(1, 5)
            it.removeIdleEntityData = generator.randomBoolean()
            it.taskTimerRef = generator.randomString()
            it
        }
        attributes
    }

    List<MetadataFilter> buildAllTypesOfFilterList() {
        List<MetadataFilter> filterList = new ArrayList<>()
        (1..generator.randomInt(4, 10)).each {
            filterList.add(buildFilter { entityAttributesFilter() })
            filterList.add(buildFilter { entityRoleWhitelistFilter() })
            filterList.add(buildFilter { signatureValidationFilter() })
            filterList.add(buildFilter { requiredValidUntilFilter() })
            filterList.add(buildFilter { nameIdFormatFilter() })
        }
        return filterList
    }

    MetadataFilter buildRandomFilterOfType(String filterType) {
        def randomFilter
        switch (filterType) {
            case 'entityAttributes':
                randomFilter = entityAttributesFilter()
                break
            case 'entityRoleWhiteList':
                randomFilter = entityRoleWhitelistFilter()
                break
            case 'signatureValidation':
                randomFilter = signatureValidationFilter()
                break
            case 'requiredValidUntil':
                randomFilter = requiredValidUntilFilter()
                break
            case 'nameIdFormat':
                randomFilter = nameIdFormatFilter()
                break
            default:
                throw new RuntimeException("Did you forget to create a TestObjectGenerator.copyOf method for filtertype: ${filterType} ?");
        }
        randomFilter
    }

    SignatureValidationFilter signatureValidationFilter() {
        new SignatureValidationFilter().with {
            it.name = 'SignatureValidation'
            it.requireSignedRoot = generator.randomBoolean()
            it.certificateFile = generator.randomString(50)
            it.defaultCriteriaRef = generator.randomString(10)
            it.signaturePrevalidatorRef = generator.randomString(10)
            it.dynamicTrustedNamesStrategyRef = generator.randomString(10)
            it.trustEngineRef = generator.randomString(10)
            it.publicKey = generator.randomString(50)
            it
        }
    }

    EntityRoleWhiteListFilter entityRoleWhitelistFilter() {
        new EntityRoleWhiteListFilter().with {
            it.name = 'EntityRoleWhiteList'
            it.retainedRoles = ['role1', 'role2']
            it.removeRolelessEntityDescriptors = true
            it
        }
    }

    EntityAttributesFilter entityAttributesFilter() {
        new EntityAttributesFilter().with {
            it.name = 'EntityAttributes'
            it.setEntityAttributesFilterTarget(buildEntityAttributesFilterTarget())
            it.setAttributes(buildAttributesList())
            it.intoTransientRepresentation()
            it
        }
    }

    EntityAttributesFilter entityAttributesFilterWithConditionScript() {
        new EntityAttributesFilter().with {
            it.name = 'EntityAttributes'
            it.setEntityAttributesFilterTarget(buildEntityAttributesFilterTargetWithConditionScript())
            it.intoTransientRepresentation()
            it
        }
    }

    EntityAttributesFilter entityAttributesFilterWithRegex() {
        new EntityAttributesFilter().with {
            it.name = 'EntityAttributes'
            it.setEntityAttributesFilterTarget(buildEntityAttributesFilterTargetWithRegex())
            it.intoTransientRepresentation()
            it
        }
    }

    RequiredValidUntilFilter requiredValidUntilFilter() {
        return new RequiredValidUntilFilter().with {
            it.maxValidityInterval = 'P14D'
            it
        }
    }

    static NameIdFormatFilter nameIdFormatFilter() {
        return new NameIdFormatFilter().with {
            it.name = "NameIDFormat"
            it.formats = ['urn:oasis:names:tc:SAML:2.0:nameid-format:persistent']
            it.nameIdFormatFilterTarget = new NameIdFormatFilterTarget(nameIdFormatFilterTargetType: ENTITY, singleValue: 'https://sp1.example.org')

            /*it.name = "NameIDFormat"
            it.formats = ['urn:oasis:names:tc:SAML:2.0:nameid-format:persistent', 'urn:oasis:names:tc:SAML:2.0:nameid-format:email']
            it.nameIdFormatFilterTarget = new NameIdFormatFilterTarget(nameIdFormatFilterTargetType: CONDITION_SCRIPT, singleValue: 'eval(true);')*/

            it
        }
    }

    RequiredValidUntilFilter copyOf(RequiredValidUntilFilter requiredValidUntilFilter) {
        new RequiredValidUntilFilter().with {
            it.name = requiredValidUntilFilter.name
            it.resourceId = requiredValidUntilFilter.resourceId
            it.maxValidityInterval = requiredValidUntilFilter.maxValidityInterval
            it
        }
    }

    SignatureValidationFilter copyOf(SignatureValidationFilter signatureValidationFilter) {
        new SignatureValidationFilter().with {
            it.name = signatureValidationFilter.name
            it.resourceId = signatureValidationFilter.resourceId
            it.trustEngineRef = signatureValidationFilter.trustEngineRef
            it.signaturePrevalidatorRef = signatureValidationFilter.signaturePrevalidatorRef
            it.publicKey = signatureValidationFilter.publicKey
            it.dynamicTrustedNamesStrategyRef = signatureValidationFilter.dynamicTrustedNamesStrategyRef
            it.requireSignedRoot = signatureValidationFilter.requireSignedRoot
            it.certificateFile = signatureValidationFilter.certificateFile
            it.defaultCriteriaRef = signatureValidationFilter.defaultCriteriaRef
            it
        }
    }

    EntityRoleWhiteListFilter copyOf(EntityRoleWhiteListFilter entityRoleWhiteListFilter) {
        new EntityRoleWhiteListFilter().with {
            it.name = entityRoleWhiteListFilter.name
            it.resourceId = entityRoleWhiteListFilter.resourceId
            it.removeEmptyEntitiesDescriptors = entityRoleWhiteListFilter.removeEmptyEntitiesDescriptors
            it.removeRolelessEntityDescriptors = entityRoleWhiteListFilter.removeRolelessEntityDescriptors
            it.retainedRoles = entityRoleWhiteListFilter.retainedRoles
            it
        }
    }

    EntityAttributesFilter copyOf(EntityAttributesFilter entityAttributesFilter) {
        new EntityAttributesFilter().with {
            it.name = entityAttributesFilter.name
            it.resourceId = entityAttributesFilter.resourceId
            it.setEntityAttributesFilterTarget(entityAttributesFilter.entityAttributesFilterTarget)
            it.setAttributes(entityAttributesFilter.attributes)
            it.intoTransientRepresentation()
            it
        }
    }

    static NameIdFormatFilter copyOf(NameIdFormatFilter nameIdFormatFilter) {
        new NameIdFormatFilter().with {
            it.name = nameIdFormatFilter.name
            it.resourceId = nameIdFormatFilter.resourceId
            it.removeExistingFormats = nameIdFormatFilter.removeExistingFormats
            it.formats = nameIdFormatFilter.formats
            it
        }
    }

    MetadataFilter buildFilter(Supplier<? extends MetadataFilter> filterSupplier) {
        MetadataFilter filter = filterSupplier.get()
        filter.setFilterEnabled(generator.randomBoolean())
        filter.setResourceId(generator.randomId())
        return filter
    }

    List<Attribute> buildAttributesList() {
        List<Attribute> attributes = new ArrayList<>()

        customPropertiesConfiguration.getOverrides().each { override ->
            if (generator.randomBoolean()) {
                switch (ModelRepresentationConversions.AttributeTypes.valueOf(override.getDisplayType().toUpperCase())) {
                    case ModelRepresentationConversions.AttributeTypes.BOOLEAN:
                        if (override.getPersistType() != null &&
                                override.getPersistType() != override.getDisplayType()) {
                            attributes.add(attributeUtility.createAttributeWithStringValues(override.getAttributeName(), override.getAttributeFriendlyName(), override.persistValue))
                        } else {
                            attributes.add(attributeUtility.createAttributeWithBooleanValue(override.getAttributeName(), override.getAttributeFriendlyName(), Boolean.valueOf(override.invert) ^ true))
                        }
                        break
                    case ModelRepresentationConversions.AttributeTypes.INTEGER:
                        attributes.add(attributeUtility.createAttributeWithIntegerValue(override.getAttributeName(), override.getAttributeFriendlyName(), generator.randomInt(0, 999999)))
                        break
                    case ModelRepresentationConversions.AttributeTypes.STRING:
                        attributes.add(attributeUtility.createAttributeWithStringValues(override.getAttributeName(), override.getAttributeFriendlyName(), generator.randomString(30)))
                        break
                    case ModelRepresentationConversions.AttributeTypes.SET:
                    case ModelRepresentationConversions.AttributeTypes.LIST:
                        attributes.add(attributeUtility.createAttributeWithStringValues(override.getAttributeName(), override.getAttributeFriendlyName(), generator.randomStringList()))
                        break
                }
            }
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithStringValues(MDDCConstants.RELEASE_ATTRIBUTES, generator.randomStringList()))
        }

        return attributes
    }

    FilterRepresentation buildFilterRepresentation() {
        FilterRepresentation representation = new FilterRepresentation()

        representation.setFilterName(generator.randomString(10))
        representation.setAttributeRelease(generator.randomStringList())
        representation.setFilterEnabled(generator.randomBoolean())
        representation.setFilterTarget(buildFilterTargetRepresentation())
        representation.setRelyingPartyOverrides(buildRelyingPartyOverridesRepresentation())

        return representation
    }

    Map<String, Object> buildRelyingPartyOverridesRepresentation() {
        def representation = [:]

        customPropertiesConfiguration.getOverrides().each { override ->
            switch (ModelRepresentationConversions.AttributeTypes.valueOf(override.getDisplayType().toUpperCase())) {
                case ModelRepresentationConversions.AttributeTypes.BOOLEAN:
                    representation.put(override.getName(), generator.randomBoolean())
                    break
                case ModelRepresentationConversions.AttributeTypes.INTEGER:
                    representation.put(override.getName(), generator.randomInt(0, 999999))
                    break
                case ModelRepresentationConversions.AttributeTypes.STRING:
                    representation.put(override.getName(), generator.randomString(30))
                    break
                case ModelRepresentationConversions.AttributeTypes.SET:
                case ModelRepresentationConversions.AttributeTypes.LIST:
                    def someStrings = new ArrayList<String>()
                    (0..generator.randomInt(1, 5)).each {
                        someStrings << generator.randomString(20)
                    }
                    representation.put(override.getName(), someStrings)
                    break
            }
        }

        representation
    }

    String buildEntityAttributesFilterTargetValueByType(EntityAttributesFilterTargetType type) {
        switch (type) {
            case EntityAttributesFilterTargetType.ENTITY:
                return generator.randomString()
            case EntityAttributesFilterTargetType.CONDITION_SCRIPT:
                return "eval(true);"
            case EntityAttributesFilterTargetType.REGEX:
                return "/foo.*/"
        }
    }

    EntityAttributesFilterTarget buildEntityAttributesFilterTarget() {
        EntityAttributesFilterTarget entityAttributesFilterTarget = new EntityAttributesFilterTarget()

        entityAttributesFilterTarget.setEntityAttributesFilterTargetType(randomFilterTargetType())
        entityAttributesFilterTarget.setSingleValue(
                buildEntityAttributesFilterTargetValueByType(entityAttributesFilterTarget.getEntityAttributesFilterTargetType()))

        return entityAttributesFilterTarget
    }

    EntityAttributesFilterTarget buildEntityAttributesFilterTargetWithConditionScript() {
        EntityAttributesFilterTarget entityAttributesFilterTarget = new EntityAttributesFilterTarget()

        entityAttributesFilterTarget.setSingleValue("Pretend this is JavaScript.")
        entityAttributesFilterTarget.setEntityAttributesFilterTargetType(
                EntityAttributesFilterTarget.EntityAttributesFilterTargetType.CONDITION_SCRIPT)

        return entityAttributesFilterTarget
    }

    EntityAttributesFilterTarget buildEntityAttributesFilterTargetWithRegex() {
        EntityAttributesFilterTarget entityAttributesFilterTarget = new EntityAttributesFilterTarget()

        entityAttributesFilterTarget.setSingleValue("/foo.*/") // JavaScript-style regex
        entityAttributesFilterTarget.setEntityAttributesFilterTargetType(
                EntityAttributesFilterTarget.EntityAttributesFilterTargetType.REGEX)

        return entityAttributesFilterTarget
    }

    FilterTargetRepresentation buildFilterTargetRepresentation() {
        FilterTargetRepresentation representation = new FilterTargetRepresentation()

        representation.setType(randomFilterTargetType().toString())
        representation.setValue([
                buildEntityAttributesFilterTargetValueByType(EntityAttributesFilterTargetType.valueOf(representation.getType()))
        ])

        return representation
    }

    EntityAttributesFilterTarget.EntityAttributesFilterTargetType randomFilterTargetType() {
        EntityAttributesFilterTarget.EntityAttributesFilterTargetType.values()[generator.randomInt(0, 2)]
    }

    EntityDescriptor buildEntityDescriptor() {
        EntityDescriptor entityDescriptor = new EntityDescriptor()

        entityDescriptor.setID(generator.randomId())
        entityDescriptor.setEntityID(generator.randomId())
        entityDescriptor.setServiceProviderName(generator.randomString(20))
        entityDescriptor.setServiceEnabled(generator.randomBoolean())
        entityDescriptor.setResourceId(generator.randomId())
        entityDescriptor.setOrganization(buildOrganization())
        entityDescriptor.addContactPerson(buildContactPerson())

        //TODO: Implement these if we ever start setting them elsewhere
        //entityDescriptor.setRoleDescriptors(buildRoleDescriptors())
        //entityDescriptor.setAdditionalMetadataLocations(buildAdditionalMetadataLocations())
        //entityDescriptor.setAuthnAuthorityDescriptor(buildAuthnAuthorityDescriptor())
        //entityDescriptor.setAttributeAuthorityDescriptor(buildAttributeAuthorityDescriptor())
        //entityDescriptor.setPdpDescriptor(buildPdpDescriptor())
        //entityDescriptor.setAffiliationDescriptor(buildAffiliationDescriptor())

        entityDescriptor.setCreatedBy(generator.randomString(10))
        entityDescriptor.setCreatedDate(generator.randomLocalDateTime())

        return entityDescriptor
    }

    Organization buildOrganization() {
        Organization organization = new edu.internet2.tier.shibboleth.admin.ui.domain.Organization()

        organization.setNamespaceURI(generator.randomString(20))
        organization.setElementLocalName(generator.randomString(20))
        organization.setNamespacePrefix(generator.randomString(5))

        organization.setOrganizationNames(buildListOfTypeWithValues(OrganizationName.class, generator.randomInt(1, 10)))
        organization.setOrganizationDisplayNames(buildListOfTypeWithValues(OrganizationDisplayName.class, generator.randomInt(1, 10)))
        organization.setOrganizationURLs(buildListOfTypeWithValues(OrganizationURL.class, generator.randomInt(1, 10)))

        //TODO: Implement these if we ever start setting them elsewhere
        //organization.setExtensions(buildExtensions())

        return organization
    }

    ContactPerson buildContactPerson() {
        ContactPerson contactPerson = new ContactPerson();

        contactPerson.setNamespaceURI(generator.randomString(20))
        contactPerson.setElementLocalName(generator.randomString(20))
        contactPerson.setNamespacePrefix(generator.randomString(5))

        return contactPerson
    }

    MetadataResolver buildRandomMetadataResolverOfType(String metadataResolverType) {
        def randomResolver
        switch (metadataResolverType) {
            case 'DynamicHttp':
                randomResolver = dynamicHttpMetadataResolver()
                break
            case 'FileBacked':
                randomResolver = fileBackedHttpMetadataResolver()
                break
            case 'LocalDynamic':
                randomResolver = localDynamicMetadataResolver()
                break
            case 'ResourceBacked':
                randomResolver = resourceBackedMetadataResolverForClasspath()
                break
            case 'Filesystem':
                randomResolver = filesystemMetadataResolver()
                break;
            default:
                throw new RuntimeException("Did you forget to create a TestObjectGenerator.<type>MetadataResolver method for resolverType: ${metadataResolverType} ?");
        }
        randomResolver
    }

    FilesystemMetadataResolver filesystemMetadataResolver() {
        new FilesystemMetadataResolver().with {
            it.name = 'FilesystemMetadata'
            it.xmlId = 'FilesystemMetadata'
            it.metadataFile = 'metadata/metadata.xml'
            it.doInitialization = Boolean.FALSE // Removed the default setting, added back to keep tests the same.

            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it
            }
            it
        }
    }

    FileBackedHttpMetadataResolver fileBackedHttpMetadataResolver() {
        new FileBackedHttpMetadataResolver().with {
            it.name = 'HTTPMetadata'
            it.xmlId = 'HTTPMetadata'
            it.backingFile = '%{idp.home}/metadata/metadata.xml'
            it.metadataURL = 'https://idp.unicon.net/idp/shibboleth'

            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it.minRefreshDelay = 'PT0M'
                it.maxRefreshDelay = 'P1D'
                it
            }
            // Changes in MetadataResolver (removing defaults), so adding back those settings here.
            it.enabled = Boolean.TRUE
            it.doInitialization = Boolean.TRUE
            it
        }
    }

    DynamicHttpMetadataResolver dynamicHttpMetadataResolver() {
        new DynamicHttpMetadataResolver().with {
            it.name = 'DynamicHTTP'
            it.xmlId = 'DynamicHTTP'
            it.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes().with {
                it
            }
            it.metadataRequestURLConstructionScheme = new MetadataQueryProtocolScheme().with {
                it.transformRef = 'transformRef'
                it.content = 'content'
                it
            }
            // Changes in MetadataResolver (removing defaults), so adding back those settings here.
            it.enabled = Boolean.TRUE
            it.doInitialization = Boolean.TRUE
            it
        }
    }

    LocalDynamicMetadataResolver localDynamicMetadataResolver() {
        def tmpDirectory = Files.createTempDirectory("groovy")
        new LocalDynamicMetadataResolver().with {
            it.name = 'LocalDynamic'
            it.xmlId = 'LocalDynamic'
            it.sourceDirectory = tmpDirectory
            it.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes().with {
                it
            }
            // Changes in MetadataResolver (removing defaults), so adding back those settings here.
            it.enabled = Boolean.TRUE
            it.doInitialization = Boolean.TRUE
            it
        }
    }

    ResourceBackedMetadataResolver resourceBackedMetadataResolverForSVN() {
        new ResourceBackedMetadataResolver().with {
            it.name = 'SVNResourceMetadata'
            it.xmlId = 'SVNResourceMetadata'
            it.svnMetadataResource = new SvnMetadataResource().with {
                it.resourceFile = 'entity.xml'
                it.repositoryURL = 'https://svn.example.org/repo/path/to.dir'
                it.workingCopyDirectory = '%{idp.home}/metadata/svn'
                it
            }
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it
            }
            // Changes in MetadataResolver (removing defaults), so adding back those settings here.
            it.enabled = Boolean.TRUE
            it.doInitialization = Boolean.TRUE
            it
        }
    }

    ResourceBackedMetadataResolver resourceBackedMetadataResolverForClasspath() {
        new ResourceBackedMetadataResolver().with {
            it.name = 'ClasspathResourceMetadata'
            it.xmlId = 'ClasspathResourceMetadata'
            it.classpathMetadataResource = new ClasspathMetadataResource().with {
                it.file = 'metadata/metadata.xml'
                it
            }
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it.refreshDelayFactor = 0.3
                it
            }
            // Changes in MetadataResolver (removing defaults), so adding back those settings here.
            it.enabled = Boolean.TRUE
            it.doInitialization = Boolean.TRUE
            it
        }
    }

    FileBackedHttpMetadataResolver buildFileBackedHttpMetadataResolver() {
        def resolver = new FileBackedHttpMetadataResolver()
        resolver.name = generator.randomString(10)
        resolver.requireValidMetadata = generator.randomBoolean()
        resolver.failFastInitialization = generator.randomBoolean()
        resolver.sortKey = generator.randomInt(0, 10)
        resolver.criterionPredicateRegistryRef = generator.randomString(10)
        resolver.useDefaultPredicateRegistry = generator.randomBoolean()
        resolver.satisfyAnyPredicates = generator.randomBoolean()
        resolver.metadataFilters = []
        resolver.reloadableMetadataResolverAttributes = buildReloadableMetadataResolverAttributes()
        resolver.httpMetadataResolverAttributes = buildHttpMetadataResolverAttributes()
        return resolver
    }

    ReloadableMetadataResolverAttributes buildReloadableMetadataResolverAttributes() {
        def attributes = new ReloadableMetadataResolverAttributes()
        attributes.parserPoolRef = generator.randomString(10)
        attributes.taskTimerRef = generator.randomString(10)
        attributes.minRefreshDelay = generator.randomString(5)
        attributes.maxRefreshDelay = generator.randomString(5)
        attributes.refreshDelayFactor = generator.randomInt(0, 5)
        attributes.indexesRef = generator.randomString(10)
        attributes.resolveViaPredicatesOnly = generator.randomBoolean()
        attributes.expirationWarningThreshold = generator.randomString(10)
        return attributes
    }

    /**
     * This method takes a type and a size and builds a List of that size containing objects of that type. This is
     * intended to be used with things that extend LocalizedName such as {@link OrganizationName}, {@link OrganizationDisplayName},
     * or with {@link OrganizationURL}s (really, a class that has a setSingleValue() method).
     *
     * @param type the type of list to generate
     * @param listSize the number of instances of that type to generate and add to the list
     * @return a list of the specified size containing objects of the specified type
     */
    private <T> List<T> buildListOfTypeWithValues(Class<T> type, int listSize) {
        List<T> list = []
        listSize.times {
            T newItemOfType = type.newInstance()
            if (newItemOfType instanceof LocalizedName) {
                newItemOfType.value = generator.randomString(10)
            } else if (newItemOfType instanceof OrganizationURL) {
                newItemOfType.value = generator.randomString(10)
            }
            list.add(newItemOfType)
        }
        return list
    }
}