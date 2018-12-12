package edu.internet2.tier.shibboleth.admin.ui;

import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.WebSecurityConfig;
import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.WebSecurityConfig.SupportedRoles;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import edu.internet2.tier.shibboleth.admin.ui.service.UsersCsvParserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@SpringBootApplication
@ComponentScan(excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "edu.internet2.tier.shibboleth.admin.ui.configuration.auto.*"))
@EntityScan(basePackages = {"edu.internet2.tier.shibboleth.admin.ui.domain", "edu.internet2.tier.shibboleth.admin.ui.security.model"})
@EnableJpaAuditing
@EnableScheduling
@EnableWebSecurity
public class ShibbolethUiApplication extends SpringBootServletInitializer {

    private static final Logger logger = LoggerFactory.getLogger(ShibbolethUiApplication.class);

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ShibbolethUiApplication.class);
    }

    public static void main(String... args) {
        SpringApplication.run(ShibbolethUiApplication.class, args);
    }

    @Component
    @Profile("dev")
    public static class MetadataResolversResourceIdEmitter {

        @Autowired
        MetadataResolverRepository metadataResolverRepository;

        @EventListener
        public void showMetadataResolversResourceIds(ApplicationStartedEvent e) {
            metadataResolverRepository.findAll()
                    .forEach(it -> logger.info(String.format("MetadataResolver [%s: %s]", it.getName(), it.getResourceId())));
        }
    }

    @Component
    public static class MetadataResolverInitializingApplicationStartupListener {

        @Autowired
        MetadataResolverService metadataResolverService;

        @Autowired
        MetadataResolverRepository metadataResolverRepository;

        @Transactional
        @EventListener
        public void initializeResolvers(ApplicationStartedEvent e) {
            metadataResolverRepository.findAll()
                    .forEach(it -> {
                        logger.info(String.format("Reloading filters for resolver [%s: %s]", it.getName(), it.getResourceId()));
                        metadataResolverService.reloadFilters(it.getResourceId());
                    });
        }
    }

    @Component
    public static class UsersBootstrapStartupListener {

        @Autowired
        UsersCsvParserService usersCsvParserService;

        @Autowired
        UserRepository userRepository;

        @Autowired
        RoleRepository roleRepository;

        private static final PasswordEncoder ENCODER = new BCryptPasswordEncoder();

        @Transactional
        @EventListener
        public void bootstrapUsersAndRoles(ApplicationStartedEvent e) {
            bootstrapRoles();
            List<User> users = usersCsvParserService.parseUsersFromCsv();
            for (User user : users) {
                User toBePersistedUser;
                Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
                if (existingUser.isPresent()) {
                    toBePersistedUser = existingUser.get();
                } else {
                    toBePersistedUser = new User();
                    toBePersistedUser.setUsername(user.getUsername());
                }
                toBePersistedUser.setFirstName(user.getFirstName());
                toBePersistedUser.setLastName(user.getLastName());
                toBePersistedUser.setPassword(ENCODER.encode(user.getPassword()));
                Set<Role> toBePersistedRoles = new HashSet<>();
                for (Role role : user.getRoles()) {
                    Optional<Role> existingRole = roleRepository.findByName(role.getName());
                    if (existingRole.isPresent()) {
                        toBePersistedRoles.add(existingRole.get());
                    }
                }
                toBePersistedUser.setRoles(toBePersistedRoles);
                userRepository.save(toBePersistedUser);
            }
        }

        private void bootstrapRoles() {
            for (SupportedRoles role : SupportedRoles.values()) {
                if (!roleRepository.findByName(role.name()).isPresent()) {
                    Role toBePersistedRole = new Role();
                    toBePersistedRole.setName(role.name());
                    roleRepository.save(toBePersistedRole);
                }
            }
        }
    }
}
