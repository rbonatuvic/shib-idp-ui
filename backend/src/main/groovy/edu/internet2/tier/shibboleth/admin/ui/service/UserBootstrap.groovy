package edu.internet2.tier.shibboleth.admin.ui.service

import com.opencsv.CSVReader
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import groovy.util.logging.Slf4j
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@Slf4j
class UserBootstrap {
    private final ShibUIConfiguration shibUIConfiguration
    private final UserRepository userRepository
    private final RoleRepository roleRepository
    private final UserService userService

    UserBootstrap(ShibUIConfiguration shibUIConfiguration, UserRepository userRepository, RoleRepository roleRepository, UserService userService, IGroupService groupService) {
        this.shibUIConfiguration = shibUIConfiguration
        this.userRepository = userRepository
        this.roleRepository = roleRepository
        this.userService = userService
        groupService.ensureAdminGroupExists()
    }

    @Transactional
    @EventListener
    void bootstrapUsersAndRoles(ApplicationStartedEvent e) {
        if (shibUIConfiguration.roles) {
            log.info("bootstrapping roles")
            shibUIConfiguration.roles.each { it ->
                def role = roleRepository.findByName(it).orElse(new Role(name: it))
                roleRepository.saveAndFlush(role)
            }
        }
        if (shibUIConfiguration.userBootstrapResource) {
            log.info("configuring users from ${shibUIConfiguration.userBootstrapResource.URI}")
            new CSVReader(new InputStreamReader(shibUIConfiguration.userBootstrapResource.inputStream)).each { it ->
                def (username, password, firstName, lastName, roleName, email) = it
                def role = roleRepository.findByName(roleName).orElse(new Role(name: roleName))
                roleRepository.saveAndFlush(role)
                def user = userRepository.findByUsername(username).orElse(new User(username: username)).with {
                    it.password = password
                    it.firstName = firstName
                    it.lastName = lastName
                    it.roles = [role]
                    it.emailAddress = email
                    it
                }
                userService.save(user)
            }
        }
    }
}