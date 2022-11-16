package net.unicon.shibui.pac4j

import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.RolesServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary

@Configuration
class Pac4JTestingConfig {
    @Bean
    @Primary
    GroupServiceForTesting groupServiceForTesting(GroupsRepository repo, OwnershipRepository ownershipRepository) {
        GroupServiceForTesting result = new GroupServiceForTesting(new GroupServiceImpl().with {
            it.groupRepository = repo
            it.ownershipRepository = ownershipRepository
            return it
        })
        result.ensureAdminGroupExists()
        return result
    }

    @Bean
    @Primary
    GroupUpdatedEntityListener groupUpdatedEntityListener(OwnershipRepository repo, GroupsRepository groupsRepository) {
        GroupUpdatedEntityListener listener = new GroupUpdatedEntityListener()
        listener.init(repo, groupsRepository)
        return listener
    }

    @Bean
    @Primary
    UserUpdatedEntityListener userUpdatedEntityListener(OwnershipRepository repo, GroupsRepository groupRepo) {
        UserUpdatedEntityListener listener = new UserUpdatedEntityListener()
        listener.init(repo, groupRepo)
        return listener
    }

    @Bean
    @Primary
    UserService userService(IGroupService groupService, OwnershipRepository ownershipRepository, RoleRepository roleRepository, UserRepository userRepository) {
        return new UserService(groupService, ownershipRepository, roleRepository, userRepository)
    }

    @Bean
    RolesServiceImpl rolesServiceImpl(RoleRepository roleRepository) {
        new RolesServiceImpl().with {
            it.roleRepository = roleRepository
            it
        }
    }
}