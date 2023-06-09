package edu.internet2.tier.shibboleth.admin.ui.configuration;

import com.fasterxml.jackson.databind.Module;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.EntityDescriptorFilesScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.ExternalMetadataProvidersScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.MetadataProvidersScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.IShibUiPermissionEvaluator;
import edu.internet2.tier.shibboleth.admin.ui.security.permission.ShibUiPermissionDelegate;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.DynamicRegistrationInfoRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.service.DefaultMetadataResolversPositionOrderContainerService;
import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryService;
import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService;
import edu.internet2.tier.shibboleth.admin.ui.service.FileCheckingFileWritingService;
import edu.internet2.tier.shibboleth.admin.ui.service.FileWritingService;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterTargetService;
import edu.internet2.tier.shibboleth.admin.ui.service.JPADynamicRegistrationServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAFilterTargetServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolversPositionOrderContainerService;
import edu.internet2.tier.shibboleth.admin.ui.service.ShibRestTemplateDelegate;
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility;
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils;
import edu.internet2.tier.shibboleth.admin.util.LuceneUtility;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;
import org.apache.lucene.analysis.Analyzer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.io.Resource;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;
import java.net.URL;

@Configuration
@Import(SearchConfiguration.class)
@ComponentScan(basePackages = "{ edu.internet2.tier.shibboleth.admin.ui.service }")
@EnableConfigurationProperties({CustomPropertiesConfiguration.class, ShibUIConfiguration.class})
public class CoreShibUiConfiguration {
    @Bean
    public OpenSamlObjects openSamlObjects() {
        return new OpenSamlObjects();
    }

    @Bean
    public EntityService jpaEntityService() {
        return new JPAEntityServiceImpl(openSamlObjects());
    }

    @Bean
    public FilterTargetService jpaFilterTargetService() {
        return new JPAFilterTargetServiceImpl();
    }

    @Bean
    public AttributeUtility attributeUtility() {
        return new AttributeUtility(openSamlObjects());
    }

    @Autowired
    LocaleResolver localeResolver;

    @Autowired
    ResourceBundleMessageSource messageSource;

    @Bean
    @ConditionalOnProperty(name = "shibui.metadata-dir")
    public EntityDescriptorFilesScheduledTasks entityDescriptorFilesScheduledTasks(
                    EntityDescriptorRepository entityDescriptorRepository,
                    @Value("${shibui.metadata-dir}") final String metadataDir) {
        return new EntityDescriptorFilesScheduledTasks(metadataDir, entityDescriptorRepository, openSamlObjects(),
                        fileWritingService());
    }

    @Bean
    @ConditionalOnProperty(name = "shibui.metadataProviders.target")
    public MetadataProvidersScheduledTasks metadataProvidersScheduledTasks(
                    @Value("${shibui.metadataProviders.target}") final Resource resource,
                    final MetadataResolverService metadataResolverService) {
        return new MetadataProvidersScheduledTasks(resource, metadataResolverService, fileWritingService());
    }

    @Bean
    @ConditionalOnProperty(name = "shibui.external.metadataProviders.target")
    public ExternalMetadataProvidersScheduledTasks externalMetadataProvidersScheduledTasks(
                    @Value("${shibui.external.metadataProviders.target}") final Resource resource,
                    final MetadataResolverService metadataResolverService) {
        return new ExternalMetadataProvidersScheduledTasks(resource, metadataResolverService, fileWritingService());
    }

    @Bean
    public EntityIdsSearchService entityIdsSearchService(LuceneUtility luceneUtility, Analyzer fullTokenAnalyzer) {
        return new EntityIdsSearchServiceImpl(luceneUtility, fullTokenAnalyzer);
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        return localeChangeInterceptor;
    }

    /**
     * A WebMvcConfigurer that won't mangle the path for the entities endpoint.
     *
     * inspired by [
     * https://stackoverflow.com/questions/13482020/encoded-slash-2f-with-spring-requestmapping-path-param-gives-http-400 ]
     *
     * @return configurer
     */
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void configurePathMatch(PathMatchConfigurer configurer) {
                UrlPathHelper helper = new UrlPathHelper() {
                    @Override
                    public String getServletPath(HttpServletRequest request) {
                        String servletPath = getOriginatingServletPath(request);
                        if (servletPath.startsWith("/api/entities")) {
                            return servletPath;
                        } else {
                            return super.getOriginatingServletPath(request);
                        }
                    }

                    @Override
                    public String getOriginatingServletPath(HttpServletRequest request) {
                        String servletPath = request.getRequestURI().substring(request.getContextPath().length());
                        if (servletPath.startsWith("/api/entities")) {
                            return servletPath;
                        } else {
                            return super.getOriginatingServletPath(request);
                        }
                    }
                };
                helper.setUrlDecode(false);
                configurer.setUrlPathHelper(helper);
            }

            @Override
            public void addInterceptors(InterceptorRegistry registry) {
                registry.addInterceptor(localeChangeInterceptor());
            }
        };
    }

    @Bean
    public MetadataResolversPositionOrderContainerService metadataResolversPositionOrderContainerService(
                    MetadataResolversPositionOrderContainerRepository positionOrderContainerRepository,
                    MetadataResolverRepository resolverRepository) {

        return new DefaultMetadataResolversPositionOrderContainerService(positionOrderContainerRepository, resolverRepository);

    }

    @Bean
    public DirectoryService directoryService() {
        return new DirectoryServiceImpl();
    }

    @Bean
    public LuceneUtility luceneUtility(DirectoryService directoryService) {
        return new LuceneUtility(directoryService);
    }

    @Bean
    public CustomPropertiesConfiguration customPropertiesConfiguration() {
        return new CustomPropertiesConfiguration();
    }

    @Bean
    public Module stringTrimModule() {
        return new StringTrimModule();
    }

    @Bean
    public ModelRepresentationConversions modelRepresentationConversions() {
        return new ModelRepresentationConversions(customPropertiesConfiguration());
    }

    @Bean
    public UserService userService(IGroupService groupService, OwnershipRepository ownershipRepository, RoleRepository roleRepository, UserRepository userRepository) {
        return new UserService(groupService, ownershipRepository, roleRepository, userRepository);
    }

    @Bean
    public FileWritingService fileWritingService() {
        return new FileCheckingFileWritingService();
    }

    @Bean
    public EntityDescriptorConversionUtils EntityDescriptorConverstionUtilsInit(EntityService entityService, OpenSamlObjects oso) {
        EntityDescriptorConversionUtils.setEntityService(entityService);
        EntityDescriptorConversionUtils.setOpenSamlObjects(oso);
        return new EntityDescriptorConversionUtils();
    }

    @Bean
    public GroupUpdatedEntityListener groupUpdatedEntityListener(OwnershipRepository repo, GroupsRepository groupsRepository) {
        GroupUpdatedEntityListener listener = new GroupUpdatedEntityListener();
        listener.init(repo, groupsRepository);
        return listener;
    }

    @Bean
    public UserUpdatedEntityListener userUpdatedEntityListener(OwnershipRepository repo, GroupsRepository groupRepo) {
        UserUpdatedEntityListener listener = new UserUpdatedEntityListener();
        listener.init(repo, groupRepo);
        return listener;
    }

    @Bean
    public IShibUiPermissionEvaluator shibUiPermissionEvaluator(EntityDescriptorRepository entityDescriptorRepository, UserService userService, DynamicRegistrationInfoRepository driRepo) {
        // TODO: @jj define type to return for Grouper integration
        return new ShibUiPermissionDelegate(driRepo, entityDescriptorRepository, userService);
    }

    @Bean
    public DynamicRegistrationService dynamicRegistrationService(DynamicRegistrationInfoRepository driRepo, OwnershipRepository ownershipRepo,
                    IShibUiPermissionEvaluator permissionEvaluator, UserService userService, IGroupService groupService,
                    @Qualifier("shibUIConfiguration") ShibUIConfiguration config, RestTemplateBuilder restTemplateBuilder) {
        ShibRestTemplateDelegate delegate = new ShibRestTemplateDelegate(config);
        return new JPADynamicRegistrationServiceImpl(groupService, driRepo, ownershipRepo, delegate, permissionEvaluator, userService);
    }
}