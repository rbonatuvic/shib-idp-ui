package edu.internet2.tier.shibboleth.admin.ui;

import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminRole;
import edu.internet2.tier.shibboleth.admin.ui.security.model.AdminUser;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.AdminRoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@ComponentScan(excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "edu.internet2.tier.shibboleth.admin.ui.configuration.auto.*"))
@EntityScan(basePackages = {"edu.internet2.tier.shibboleth.admin.ui.domain", "edu.internet2.tier.shibboleth.admin.ui.security.model"})
@EnableJpaAuditing
@EnableScheduling
@EnableWebSecurity
public class ShibbolethUiApplication extends SpringBootServletInitializer {

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
        void showMetadataResolversResourceIds(ApplicationStartedEvent e) {
            metadataResolverRepository.findAll()
                    .forEach(it -> System.out.println(String.format("MetadataResolver [%s: %s]", it.getName(), it.getResourceId())));
        }
    }

    @Component
    @Profile("dev")
    public static class SampleAdminUsersCreator {

        @Autowired
        AdminUserRepository adminUserRepository;

        @Autowired
        AdminRoleRepository adminRoleRepository;

        @Transactional
        @EventListener
        void createSampleAdminUsers(ApplicationStartedEvent e) {
            if(adminUserRepository.count() == 0L) {
                AdminRole role = new AdminRole();
                role.setName("ROLE_ADMIN");
                AdminUser user = new AdminUser();
                user.setUsername("admin");
                user.setPassword("{noop}adminpass");

                //The complexity of managing bi-directional many-to-many. TODO: to encapsulate this association
                //managing logic into domain model itself
                role.getAdmins().add(user);
                user.getRoles().add(role);

                adminUserRepository.save(user);
            }
        }
    }
}
