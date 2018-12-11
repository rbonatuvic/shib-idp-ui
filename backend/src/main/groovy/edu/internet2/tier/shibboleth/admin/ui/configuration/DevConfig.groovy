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

    private final MetadataResolverRepository metadataResolverRepository

    DevConfig(UserRepository adminUserRepository, MetadataResolverRepository metadataResolverRepository) {
        this.adminUserRepository = adminUserRepository
        this.metadataResolverRepository = metadataResolverRepository
    }

    @Transactional
    @PostConstruct
    void createDevUsers() {
        if (adminUserRepository.count() == 0) {
            def users = [new User().with {
                username = 'admin'
                password = '{noop}adminpass'
                name = 'Joe the admin'
                emailAddress = 'joe@institution.edu'
                roles.add(new Role(name: 'ROLE_ADMIN'))
                it
            }, new User().with {
                username = 'nonadmin'
                password = '{noop}nonadminpass'
                name = 'Peter non admin'
                emailAddress = 'peter@institution.edu'
                roles.add(new Role(name: 'ROLE_USER'))
                it
            }]
            users.each {
                adminUserRepository.save(it)
            }

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
