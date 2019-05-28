package edu.internet2.tier.shibboleth.admin.ui.configuration


import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.*
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.annotation.PostConstruct

@Component
@Profile('dev')
class DevConfig {
    private final UserRepository adminUserRepository
    private final RoleRepository roleRepository

    private final MetadataResolverRepository metadataResolverRepository
    private final EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    private OpenSamlObjects openSamlObjects

    DevConfig(UserRepository adminUserRepository, MetadataResolverRepository metadataResolverRepository, RoleRepository roleRepository, EntityDescriptorRepository entityDescriptorRepository) {
        this.adminUserRepository = adminUserRepository
        this.metadataResolverRepository = metadataResolverRepository
        this.roleRepository = roleRepository
        this.entityDescriptorRepository = entityDescriptorRepository
    }

    @Transactional
    @PostConstruct
    void createDevUsers() {
        if (roleRepository.count() == 0) {
            def roles = [new Role().with {
                name = 'ROLE_ADMIN'
                it
            }, new Role().with {
                name = 'ROLE_USER'
                it
            }, new Role().with {
                name = 'ROLE_NONE'
                it
            }]
            roles.each {
                roleRepository.save(it)
            }
        }
        roleRepository.flush()
        if (adminUserRepository.count() == 0) {
            def users = [new User().with {
                username = 'admin'
                password = '{noop}adminpass'
                firstName = 'Joe'
                lastName = 'Doe'
                emailAddress = 'joe@institution.edu'
                roles.add(roleRepository.findByName('ROLE_ADMIN').get())
                it
            }, new User().with {
                username = 'nonadmin'
                password = '{noop}nonadminpass'
                firstName = 'Peter'
                lastName = 'Vandelay'
                emailAddress = 'peter@institution.edu'
                roles.add(roleRepository.findByName('ROLE_USER').get())
                it
            }, new User().with { // allow us to auto-login as an admin
                username = 'anonymousUser'
                password = '{noop}anonymous'
                firstName = 'Anon'
                lastName = 'Ymous'
                emailAddress = 'anon@institution.edu'
                roles.add(roleRepository.findByName('ROLE_ADMIN').get())
                it
            }]
            users.each {
                adminUserRepository.save(it)
            }
            adminUserRepository.flush()
        }
    }

    @Transactional
    @Profile('fbhmr')
    @Bean
    MetadataResolver fbhmr(ModelRepresentationConversions modelRepresentationConversions) {
        return this.metadataResolverRepository.save(new FileBackedHttpMetadataResolver().with {
            enabled = true
            xmlId = 'test-fbhmr'
            name = 'test-fbhmr'
            metadataURL = 'http://md.incommon.org/InCommon/InCommon-metadata.xml'
            backingFile = '%{idp.home}/test-fbhmr.xml'
            reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes()
            httpMetadataResolverAttributes = new HttpMetadataResolverAttributes()
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.name = 'test'
                it.filterEnabled = true
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.value = ["https://carmenwiki.osu.edu/shibboleth"]
                    return it
                }
                it.attributeRelease = ['eduPersonPrincipalName', 'givenName', 'surname', 'mail']
                it.relyingPartyOverrides = null
                return it
            })
            return it
        })
    }

    @Profile('dhmr')
    @Transactional
    @Bean
    MetadataResolver dhmr(ModelRepresentationConversions modelRepresentationConversions) {
        return this.metadataResolverRepository.save(new DynamicHttpMetadataResolver().with {
            it.enabled = true
            it.xmlId = 'test-dhmr'
            it.name = 'test-dhmr'
            it.metadataRequestURLConstructionScheme = new MetadataQueryProtocolScheme(content: 'http://mdq-beta.incommon.org/global')
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.name = 'test'
                it.filterEnabled = true
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.value = ["https://issues.shibboleth.net/shibboleth"]
                    return it
                }
                it.attributeRelease = ['eduPersonPrincipalName', 'givenName', 'surname', 'mail']
                it.relyingPartyOverrides = null
                return it
            })
            return it
        })
    }

    @Profile('ed')
    @Transactional
    @Bean
    EntityDescriptor ed() {
        return this.entityDescriptorRepository.save(new EntityDescriptor().with {
            it.createdBy = 'nonadmin'
            it.entityID = 'testID'
            it.serviceEnabled = true
            it.serviceProviderName = 'testSP'
            it
        })
    }

    @Profile('dev-ed-versioning')
    @Bean
    EntityDescriptorVersionService stubEntityDescriptorVersionService(EntityDescriptorService entityDescriptorService,
                                                                      EntityDescriptorRepository entityDescriptorRepository) {
        return EntityDescriptorVersionService.stubImpl(entityDescriptorService, entityDescriptorRepository)
    }

    @Transactional
    @EventListener
    void edForVersioningDev(ApplicationStartedEvent e) {
        if (e.applicationContext.environment.activeProfiles.contains('dev-ed-versioning')) {
            this.entityDescriptorRepository.save(EntityDescriptors.prebakedEntityDescriptor(openSamlObjects))
        }
    }
}
