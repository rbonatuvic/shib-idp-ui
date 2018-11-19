package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.annotation.PostConstruct

@Component
@Profile('dev')
class DevConfig {
    private final UserRepository adminUserRepository

    DevConfig(UserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository
    }

    @Transactional
    @PostConstruct
    void createDevAdminUsers() {
        if (adminUserRepository.count() == 0) {
            def user = new User().with {
                username = 'admin'
                password = '{noop}adminpass'
                roles.add(new Role(name: 'ROLE_ADMIN'))
                it
            }

            adminUserRepository.save(user)
        }
    }
}
