package edu.internet2.tier.shibboleth.admin.ui.service

import com.opencsv.CSVReader
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
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

    UserBootstrap(ShibUIConfiguration shibUIConfiguration, UserRepository userRepository, RoleRepository roleRepository) {
        this.shibUIConfiguration = shibUIConfiguration
        this.userRepository = userRepository
        this.roleRepository = roleRepository
    }

    @Transactional
    @EventListener
    void bootstrapUsersAndRoles(ApplicationStartedEvent e) {
        if (shibUIConfiguration.userBootstrapResource.isPresent()) {
            log.info("configuring users from ${shibUIConfiguration.userBootstrapResource.get().URI}")
            new CSVReader(new InputStreamReader(shibUIConfiguration.userBootstrapResource.get().inputStream)).each { it ->
                def (username, password, firstName, lastName, roleName) = it
                def role = roleRepository.findByName(roleName).orElse(roleRepository.save(new Role(name: roleName)))
                def user = userRepository.findByUsername(username).orElse(new User(username: username)).with {
                    it.password = password
                    it.firstName = firstName
                    it.lastName = lastName
                    it.roles.add(role)
                    it
                }
                userRepository.save(user)
            }
        }
    }
}
