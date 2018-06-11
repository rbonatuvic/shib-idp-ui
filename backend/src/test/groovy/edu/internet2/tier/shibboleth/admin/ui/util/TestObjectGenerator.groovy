package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute
import edu.internet2.tier.shibboleth.admin.ui.domain.ContactPerson
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.LocalizedName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationDisplayName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationURL
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterTargetRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants
import org.opensaml.saml.saml2.metadata.Organization

import static edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes.HttpCachingType.memory

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class TestObjectGenerator {

    AttributeUtility attributeUtility

    RandomGenerator generator = new RandomGenerator()

    TestObjectGenerator(AttributeUtility attributeUtility) {
        this.attributeUtility = attributeUtility
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
            it.requestTimeout = generator.randomString(10)
            it.socketTimeout = generator.randomString(10)
            it.tlsTrustEngineRef = generator.randomString(10)
            it
        }
        return attributes
    }

    List<EntityAttributesFilter> buildFilterList() {
        List<EntityAttributesFilter> filterList = new ArrayList<>()
        (1..generator.randomInt(4, 10)).each {
            filterList.add(buildEntityAttributesFilter())
        }
        return filterList
    }

    EntityAttributesFilter buildEntityAttributesFilter() {
        EntityAttributesFilter filter = new EntityAttributesFilter()

        filter.setName(generator.randomString(10))
        filter.setFilterEnabled(generator.randomBoolean())
        filter.setResourceId(generator.randomId())
        filter.setEntityAttributesFilterTarget(buildEntityAttributesFilterTarget())
        filter.setAttributes(buildAttributesList())

        return filter
    }

    List<Attribute> buildAttributesList() {
        List<Attribute> attributes = new ArrayList<>()

        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.SIGN_ASSERTIONS, MDDCConstants.SIGN_ASSERTIONS_FN, true))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.SIGN_RESPONSES, MDDCConstants.SIGN_RESPONSES_FN, false))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.ENCRYPT_ASSERTIONS, MDDCConstants.ENCRYPT_ASSERTIONS_FN, false))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.SECURITY_CONFIGURATION, MDDCConstants.SECURITY_CONFIGURATION_FN, "shibboleth.SecurityConfiguration.SHA1"))
        }
        if (generator.randomBoolean()) {
            // this is actually going to be wrong, but it will work for the time being. this should be a bitmask value that we calculate
            // TODO: fix
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.DISALLOWED_FEATURES, MDDCConstants.DISALLOWED_FEATURES_FN, "0x1"))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE, MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE_FN, false))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.RESPONDER_ID, MDDCConstants.RESPONDER_ID_FN, generator.randomId()))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.NAME_ID_FORMAT_PRECEDENCE, MDDCConstants.NAME_ID_FORMAT_PRECEDENCE_FN, generator.randomStringList()))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.DEFAULT_AUTHENTICATION_METHODS, MDDCConstants.DEFAULT_AUTHENTICATION_METHODS_FN, generator.randomStringList()))
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

    RelyingPartyOverridesRepresentation buildRelyingPartyOverridesRepresentation() {
        RelyingPartyOverridesRepresentation representation = new RelyingPartyOverridesRepresentation()

        representation.setAuthenticationMethods(generator.randomStringList())
        representation.setDontSignResponse(generator.randomBoolean())
        representation.setIgnoreAuthenticationMethod(generator.randomBoolean())
        representation.setNameIdFormats(generator.randomStringList())
        representation.setOmitNotBefore(generator.randomBoolean())
        representation.setSignAssertion(generator.randomBoolean())
        representation.setTurnOffEncryption(generator.randomBoolean())
        representation.setUseSha(generator.randomBoolean())
        representation.setResponderId(generator.randomId())

        return representation
    }

    EntityAttributesFilterTarget buildEntityAttributesFilterTarget() {
        EntityAttributesFilterTarget entityAttributesFilterTarget = new EntityAttributesFilterTarget()

        entityAttributesFilterTarget.setValue(generator.randomStringList())
        entityAttributesFilterTarget.setEntityAttributesFilterTargetType(randomFilterTargetType())

        return entityAttributesFilterTarget
    }

    FilterTargetRepresentation buildFilterTargetRepresentation() {
        FilterTargetRepresentation representation = new FilterTargetRepresentation()

        representation.setValue(generator.randomStringList())
        representation.setType(randomFilterTargetType().toString())

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

    FileBackedHttpMetadataResolver fileBackedHttpMetadataResolver() {
        new FileBackedHttpMetadataResolver().with {
            it.name = 'HTTPMetadata'
            it.backingFile = '%{idp.home}/metadata/incommonmd.xml'
            it.metadataURL = 'http://md.incommon.org/InCommon/InCommon-metadata.xml'

            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it.minRefreshDelay = 'PT5M'
                it.maxRefreshDelay = 'PT1H'
                it.refreshDelayFactor = 0.75
                it
            }
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
        resolver.metadataFilters = buildFilterList()
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
     * or with {@link OrganizationURL}s (really, a class that has a setValue() method).
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
