package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.annotation.PostConstruct

@Component
@Profile('dev')
class DevConfig {
    private final UserRepository adminUserRepository
    private final RoleRepository roleRepository

    private final MetadataResolverRepository metadataResolverRepository

    DevConfig(UserRepository adminUserRepository, MetadataResolverRepository metadataResolverRepository, RoleRepository roleRepository) {
        this.adminUserRepository = adminUserRepository
        this.metadataResolverRepository = metadataResolverRepository
        this.roleRepository = roleRepository
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
}
