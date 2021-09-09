package edu.internet2.tier.shibboleth.admin.ui

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.StringTrimModule
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary

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
    GroupUpdatedEntityListener groupUpdatedEntityListener(OwnershipRepository ownershipRepository) {
        GroupUpdatedEntityListener listener = new GroupUpdatedEntityListener()
        listener.init(ownershipRepository)
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
        ObjectMapper mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
        mapper.setSerializationInclusion(NON_NULL)
        mapper.registerModule(new JavaTimeModule())
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
}