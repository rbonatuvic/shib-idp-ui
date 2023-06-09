package edu.internet2.tier.shibboleth.admin.ui

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.StringTrimModule
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.permission.IShibUiPermissionEvaluator
import edu.internet2.tier.shibboleth.admin.ui.security.permission.ShibUiPermissionDelegate
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL

@Configuration
@Import([ShibUIConfiguration.class, CustomPropertiesConfiguration.class, SearchConfiguration.class])
@ComponentScan(basePackages=[ "edu.internet2.tier.shibboleth.admin.ui.service", "edu.internet2.tier.shibboleth.admin.ui.security.service",
                              "edu.internet2.tier.shibboleth.admin.ui.security.model.listener"])
class BaseDataJpaTestConfiguration {
    @Bean
    AttributeUtility attributeUtility(OpenSamlObjects openSamlObjects) {
        return new AttributeUtility(openSamlObjects)
    }

    @Bean
    @Primary
    GroupServiceForTesting groupServiceForTesting(GroupsRepository groupRepo, OwnershipRepository ownershipRepository) {
        GroupServiceForTesting result = new GroupServiceForTesting(new GroupServiceImpl().with {
            it.groupRepository = groupRepo
            it.ownershipRepository = ownershipRepository
            return it
        })
        result.ensureAdminGroupExists()
        return result
    }

    @Bean
    GroupUpdatedEntityListener groupUpdatedEntityListener(OwnershipRepository ownershipRepository, GroupsRepository groupsRepository) {
        GroupUpdatedEntityListener listener = new GroupUpdatedEntityListener()
        listener.init(ownershipRepository, groupsRepository)
        return listener
    }

    @Bean
    JPAEntityServiceImpl jpaEntityService(OpenSamlObjects openSamlObjects, AttributeUtility attributeUtility,
                                          CustomPropertiesConfiguration customPropertiesConfiguration) {
        return new JPAEntityServiceImpl(openSamlObjects, attributeUtility, customPropertiesConfiguration)
    }

    @Bean
    ModelRepresentationConversions modelRepresentationConversions(CustomPropertiesConfiguration customPropertiesConfiguration) {
        return new ModelRepresentationConversions(customPropertiesConfiguration)
    }

    @Bean
    ObjectMapper objectMapper() {
        JavaTimeModule module = new JavaTimeModule()
        LocalDateTimeDeserializer localDateTimeDeserializer =  new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS"))
        module.addDeserializer(LocalDateTime.class, localDateTimeDeserializer)
        ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().modules(module).featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).build()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
        mapper.setSerializationInclusion(NON_NULL)
        mapper.registerModule(new StringTrimModule())
        return mapper
    }

    @Bean
    @Primary
    OpenSamlObjects openSamlObjects() {
        OpenSamlObjects result = new OpenSamlObjects()
        result.init()
        return result
    }

    @Bean
    @Primary
    TestObjectGenerator testObjectGenerator (AttributeUtility attributeUtility, CustomPropertiesConfiguration customPropertiesConfiguration) {
        customPropertiesConfiguration.postConstruct()
        return new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
    }

    @Bean
    UserUpdatedEntityListener userUpdatedEntityListener(OwnershipRepository ownershipRepository, GroupsRepository groupRepo) {
        UserUpdatedEntityListener listener = new UserUpdatedEntityListener()
        listener.init(ownershipRepository, groupRepo)
        return listener
    }

    @Bean
    public IShibUiPermissionEvaluator shibUiPermissionEvaluator(DynamicRegistrationInfoRepository driRepo, EntityDescriptorRepository entityDescriptorRepository, UserService userService) {
        return new ShibUiPermissionDelegate(driRepo, entityDescriptorRepository, userService);
    }
}