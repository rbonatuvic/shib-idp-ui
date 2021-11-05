package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget.EntityAttributesFilterTargetType.CONDITION_SCRIPT

/**
 * Testing persistence of the MetadataResolver models
 */
@Rollback
class MetadataResolverRepositoryTests extends AbstractBaseDataJpaTest {
    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityDescriptorService service

    def "test persisting a metadata resolver"() {
        when:
        def mdr = create { new MetadataResolver() }
        metadataResolverRepository.save(mdr)

        then:
        basicPersistenceOfResolverIsCorrectFor { it instanceof MetadataResolver }
    }

    def "SHIBUI-553"() {
        when:
        def mdr = create { new MetadataResolver() }
        metadataResolverRepository.save(mdr)
        entityManager.flush()
        entityManager.clear()

        def hashCode1 = metadataResolverRepository.findByName('testme').hashCode()
        entityManager.clear()
        def hashCode2 = metadataResolverRepository.findByName('testme').hashCode()

        then:
        hashCode1 == hashCode2
    }

    def "persisting and performing transformation into transient representation for EntityAttributesFilter correctly"() {
        when:
        def mdr = new MetadataResolver().with {
            it.name = "testme"
            it
        }
        metadataResolverRepository.save(mdr)

        entityManager.flush()
        entityManager.clear()

        //Simulate adding new filter with incoming transient attribute release value as done in MetadataFiltersController
        def filter = new EntityAttributesFilter().with {
            it.name = 'original'
            it.resourceId = 'new-filter-UUID'
            it.attributeRelease = ['attr-for-release']
            it.setRelyingPartyOverrides(['signAssertion': true]) // to make sure it.rebuildAttributes() is called
            it
        }
        MetadataResolver metadataResolver = metadataResolverRepository.findAll().iterator().next()

        metadataResolver.getMetadataFilters().add(filter)
        MetadataResolver persistedMr = metadataResolverRepository.save(metadataResolver)

        entityManager.flush()
        entityManager.clear()

        //This is how it's done in MetadataFiltersController POST/PUT to return the newly saved object back to UI layer
        // We are checking here that the method responsible for converting persistent state into the
        // transient state used by UI is performed correctly
        EntityAttributesFilter persistedFilter = persistedMr.getMetadataFilters().find {
            it.resourceId == filter.resourceId
        }
        //convert before returning to UI
        persistedFilter.intoTransientRepresentation()

        then:
        persistedFilter.name == 'original'
        persistedFilter.attributeRelease.find() {
            it == 'attr-for-release'
        }
        persistedFilter.attributes.findAll() {
            it.attributeValues.find() {
                it.value == 'attr-for-release'
            }
        }
        persistedFilter.relyingPartyOverrides["signAssertion"]

        when:
        entityManager.flush()
        entityManager.clear()
        //Now lets update our filter
        filter = new EntityAttributesFilter().with {
            it.name = 'updated'
            it.resourceId = 'new-filter-UUID'
            it.attributeRelease = ['attr-for-release', 'attr-for-release2']
            it.relyingPartyOverrides = ['signAssertion': false]
            it
        }
        metadataResolver = metadataResolverRepository.findAll().iterator().next()
        EntityAttributesFilter filterToBeUpdated = metadataResolver.metadataFilters.find() {
            it.resourceId == filter.resourceId
        }
        filterToBeUpdated.name = filter.name
        filterToBeUpdated.entityAttributesFilterTarget = filter.entityAttributesFilterTarget
        filterToBeUpdated.relyingPartyOverrides = filter.relyingPartyOverrides
        filterToBeUpdated.attributeRelease = filter.attributeRelease

        entityManager.clear()
        persistedMr = metadataResolverRepository.save(metadataResolver)


        persistedFilter = persistedMr.getMetadataFilters().find {
            it.resourceId == filter.resourceId
        }
        //convert before returning to UI
        persistedFilter.intoTransientRepresentation()

        then:
        persistedFilter.name == 'updated'
        persistedFilter.attributeRelease.find() {
            it == 'attr-for-release'
        }
        persistedFilter.attributeRelease.find() {
            it == 'attr-for-release2'
        }
        persistedFilter.attributes.find() {
            it.attributeValues.findAll() {
                it.value == 'attr-for-release'
            }
        }
        persistedFilter.attributes.find() {
            it.attributeValues.findAll() {
                it.value == 'attr-for-release2'
            }
        }
        !persistedFilter.relyingPartyOverrides["signAssertion"]
    }

    def "test persisting DynamicHttpMetadataResolver "() {
        when:
        def mdr = create { new DynamicHttpMetadataResolver() }
        metadataResolverRepository.save(mdr)

        then:
        basicPersistenceOfResolverIsCorrectFor { it instanceof DynamicHttpMetadataResolver }
    }

    def "test persisting FileBackedHttpMetadataResolver "() {
        when:
        def mdr = create { new FileBackedHttpMetadataResolver() }
        metadataResolverRepository.save(mdr)

        then:
        basicPersistenceOfResolverIsCorrectFor { it instanceof FileBackedHttpMetadataResolver }
    }

    def "test persisting LocalDynamicMetadataResolver "() {
        when:
        def mdr = create { new LocalDynamicMetadataResolver() }
        metadataResolverRepository.save(mdr)

        then:
        basicPersistenceOfResolverIsCorrectFor { it instanceof LocalDynamicMetadataResolver }
    }

    def "persisting entity attributes filter target with script of 760 max chars, as defied in DB schema mapping"() {
        given:
        def mdr = new MetadataResolver().with {
            it.name = "SHIBUI-1588"
            it
        }
        def filter = new EntityAttributesFilter().with {
            it.name = 'SHIBUI-1588'
            it.resourceId = 'SHIBUI-1588'
            it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                it.entityAttributesFilterTargetType = CONDITION_SCRIPT
                it.singleValue = '/*' + ('X' * 756) + '*/'
                it
            }
            it
        }
        mdr.addFilter(filter)

        when:
        metadataResolverRepository.save(mdr)
        entityManager.flush()

        then:
        noExceptionThrown()
    }

    private void basicPersistenceOfResolverIsCorrectFor(Closure resolverTypeCheck) {
        assert metadataResolverRepository.findAll().size() > 0
        MetadataResolver item = metadataResolverRepository.findByName("testme")
        assert resolverTypeCheck(item)
        assert item.name == "testme"
        assert item.metadataFilters.size() == 1
        assert item.metadataFilters.get(0).entityAttributesFilterTarget.entityAttributesFilterTargetType == EntityAttributesFilterTarget
                .EntityAttributesFilterTargetType.ENTITY
        assert item.metadataFilters.get(0).entityAttributesFilterTarget.value.size() == 1
        assert item.metadataFilters.get(0).entityAttributesFilterTarget.value.get(0) == "hola"
    }

    private MetadataResolver create(Closure concreteResolverSupplier) {
        MetadataResolver resolver = concreteResolverSupplier()
        resolver.with {
            it.name = "testme"
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.value = ["hola"]
                    return it
                }
                return it
            })
        }
        resolver
    }
}
