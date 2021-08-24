package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.annotation.PostConstruct

@Component
@Profile('dev')
class DevConfig {
    private final EntityDescriptorRepository entityDescriptorRepository
    private final GroupsRepository groupsRepository
    private final MetadataResolverRepository metadataResolverRepository
    private final OpenSamlObjects openSamlObjects
    private final RoleRepository roleRepository
    private final UserRepository userRepository
    
    @Autowired
    private UserService userService

    DevConfig(UserRepository adminUserRepository,
              GroupsRepository groupsRepository,
              MetadataResolverRepository metadataResolverRepository,
              RoleRepository roleRepository,
              EntityDescriptorRepository entityDescriptorRepository,
              OpenSamlObjects openSamlObjects, 
              IGroupService groupService) {

        this.userRepository = adminUserRepository
        this.metadataResolverRepository = metadataResolverRepository
        this.roleRepository = roleRepository
        this.entityDescriptorRepository = entityDescriptorRepository
        this.openSamlObjects = openSamlObjects
        this.groupsRepository = groupsRepository
        
        groupService.ensureAdminGroupExists()
    }

    @Transactional
    @PostConstruct
    void createDevUsersAndGroups() {
        def groups = [
            new Group().with {
                it.name = "A1"
                it.description = "AAA Group"
                it.resourceId = "AAA"
                it
            },
            new Group().with {
                it.name = "B1"
                it.description = "BBB Group"
                it.resourceId = "BBB"                    
                it
            }]
        groups.each {
            try {
                groupsRepository.save(it)
            } catch (Throwable e) {
                // Must already exist (from a unit test)
            }
        }            
        groupsRepository.flush()
        
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
        if (userRepository.count() == 0) {
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
            }, new User().with {
                username = 'none'
                password = '{noop}nonepass'
                firstName = 'Bad'
                lastName = 'robot'
                emailAddress = 'badboy@institution.edu'
                roles.add(roleRepository.findByName('ROLE_NONE').get())
                it
            }, new User().with {
                username = 'none2'
                password = '{noop}none2pass'
                firstName = 'Bad'
                lastName = 'robot2'
                emailAddress = 'badboy2@institution.edu'
                roles.add(roleRepository.findByName('ROLE_NONE').get())
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
                userService.save(it)
            }
        }
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
}
