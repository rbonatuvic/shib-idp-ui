package edu.internet2.tier.shibboleth.admin.ui.security.permission

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional

@Rollback
class ShibUiPermissionDelegateTests extends AbstractBaseDataJpaTest {
    ShibUiPermissionDelegate delegate

    @Autowired
    JPAEntityDescriptorServiceImpl jpaEntityDescriptorService

    def entityDescriptor
    def entityDescriptor2
    def entityDescriptor3

    @Transactional
    def setup() {
        delegate = new ShibUiPermissionDelegate(entityDescriptorRepository, userService)
        createDevUsersAndGroups()
    }

    def createDevUsersAndGroups() {
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
                groupRepository.save(it)
            } catch (Throwable e) {
                // Must already exist (from a unit test)
            }
        }
        groupRepository.flush()

        List<Group> apprGroups = new ArrayList<>()
        String[] groupNames = ['XXX', 'YYY', 'ZZZ']
        groupNames.each {name -> {
            Group group = new Group().with({
                it.name = name
                it.description = name
                it.resourceId = name
                it
            })
            if (name != "ZZZ") {
                apprGroups.add(groupRepository.save(group))
            } else {
                Approvers approvers = new Approvers()
                approvers.setApproverGroups(apprGroups)
                List<Approvers> apprList = new ArrayList<>()
                apprList.add(approversRepository.save(approvers))
                group.setApproversList(apprList)
                groupRepository.save(group)
            }
        }}
        groupRepository.flush()

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
            }, new Role().with {
                name = 'ROLE_ENABLE'
                it
            }]
            roles.each {
                roleRepository.save(it)
            }
        }
        roleRepository.flush()
        if (userRepository.count() < 2) {
            userRepository.deleteAll()
            def users = [new User().with {
                username = 'admin'
                password = '{noop}adminpass'
                firstName = 'Joe'
                lastName = 'Doe'
                emailAddress = 'joe@institution.edu'
                roles.add(roleRepository.findByName('ROLE_ADMIN').get())
                it
            }, new User().with {
                username = 'enableZ'
                password = '{noop}nonadminpass'
                firstName = 'Peter'
                lastName = 'Vandelay'
                emailAddress = 'peter@institution.edu'
                setGroupId('ZZZ')
                roles.add(roleRepository.findByName('ROLE_ENABLE').get())
                it
            }, new User().with {
                username = 'Approver'
                password = '{noop}password'
                firstName = 'Bad'
                lastName = 'robot'
                emailAddress = 'badboy@institution.edu'
                setGroupId('XXX')
                roles.add(roleRepository.findByName('ROLE_USER').get())
                it
            }, new User().with {
                username = 'Submitter'
                password = '{noop}password'
                firstName = 'Bad'
                lastName = 'robot2'
                emailAddress = 'badboy2@institution.edu'
                setGroupId('ZZZ')
                roles.add(roleRepository.findByName('ROLE_NONE').get())
                it
            }]
            users.each {
                userService.save(it)
            }
        }
        entityManager.flush()
        entityManager.clear()

        entityDescriptor = new EntityDescriptor(resourceId: 'uuid-1', entityID: 'eid1', serviceProviderName: 'sp1', serviceEnabled: false, idOfOwner: 'ZZZ')
        def edid = jpaEntityDescriptorService.createNew(entityDescriptor).getId()
        entityManager.flush()
        entityDescriptor2 = new EntityDescriptor(resourceId: 'uuid-2', entityID: 'eid2', serviceProviderName: 'sp2', serviceEnabled: false, idOfOwner: 'XXX')
        def edid2 = jpaEntityDescriptorService.createNew(entityDescriptor2).getId()
        entityManager.flush()
        entityDescriptor3 = new EntityDescriptor(resourceId: 'uuid-3', entityID: 'eid3', serviceProviderName: 'sp3', serviceEnabled: false, idOfOwner: 'YYY')
        def edid3 = jpaEntityDescriptorService.createNew(entityDescriptor3).getId()
        entityManager.flush()

        jpaEntityDescriptorService.updateGroupForEntityDescriptor(edid, 'ZZZ')
        jpaEntityDescriptorService.updateGroupForEntityDescriptor(edid2, 'XXX')
        jpaEntityDescriptorService.updateGroupForEntityDescriptor(edid3, 'YYY')
        entityManager.flush()
    }

    @WithMockAdmin
    def testAdmin() {
        expect:
        delegate.hasPermission(userService.getCurrentUserAuthentication(), "doesn't matter", PermissionType.admin)
        delegate.hasPermission(null, "doesn't matter", PermissionType.admin)
    }

    @WithMockUser(username = "Approver", roles = ["USER"])
    def testApproverPerms() {
        expect:
        userRepository.findAll().size() == 4
        !delegate.hasPermission(null, "doesn't matter", PermissionType.admin)
        !delegate.hasPermission(null, entityDescriptor, PermissionType.enable)
        !delegate.hasPermission(null, entityDescriptor2, PermissionType.enable)
        !delegate.hasPermission(null, entityDescriptor3, PermissionType.enable)

        delegate.hasPermission(null, entityDescriptor, PermissionType.approve)
        !delegate.hasPermission(null, entityDescriptor2, PermissionType.approve)
        !delegate.hasPermission(null, entityDescriptor3, PermissionType.approve)

        delegate.hasPermission(null, entityDescriptor, PermissionType.viewOrEdit)
        delegate.hasPermission(null, entityDescriptor2, PermissionType.viewOrEdit)
        !delegate.hasPermission(null, entityDescriptor3, PermissionType.viewOrEdit)

        when:
        def Collection fetch = delegate.getPersistentEntities(null, ShibUiPermissibleType.entityDescriptorProjection, PermissionType.fetch)
        def Collection approve = delegate.getPersistentEntities(null, ShibUiPermissibleType.entityDescriptorProjection, PermissionType.approve)

        then:
        fetch.size() == 1
        ((EntityDescriptorProjection)fetch.iterator().next()).getEntityID().equals("eid2")

        approve.size() == 1
        ((EntityDescriptorProjection)approve.iterator().next()).getEntityID().equals("eid1")

        when:
        delegate.getPersistentEntities(null, ShibUiPermissibleType.entityDescriptorProjection, PermissionType.enable)

        then:
        thrown (ForbiddenException)
    }
}