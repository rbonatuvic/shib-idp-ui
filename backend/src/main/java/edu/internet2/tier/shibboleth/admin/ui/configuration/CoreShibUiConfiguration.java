package edu.internet2.tier.shibboleth.admin.ui.configuration;

import com.fasterxml.jackson.databind.Module;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.EntityDescriptorFilesScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.scheduled.MetadataProvidersScheduledTasks;
import edu.internet2.tier.shibboleth.admin.ui.service.DefaultMetadataResolversPositionOrderContainerService;
import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryService;
import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterTargetService;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAFilterServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAFilterTargetServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.JPAMetadataResolverServiceImpl;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolversPositionOrderContainerService;
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility;
import edu.internet2.tier.shibboleth.admin.util.LuceneUtility;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;
import org.apache.lucene.analysis.Analyzer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;

@Configuration
@EnableConfigurationProperties(CustomPropertiesConfiguration.class)
public class CoreShibUiConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(CoreShibUiConfiguration.class);

    @Bean
    public OpenSamlObjects openSamlObjects() {
        return new OpenSamlObjects();
    }

    @Bean
    public EntityService jpaEntityService() {
        return new JPAEntityServiceImpl(openSamlObjects());
    }

    @Bean
    public EntityDescriptorService jpaEntityDescriptorService() {
        return new JPAEntityDescriptorServiceImpl(openSamlObjects(), jpaEntityService());
    }

    @Bean
    public FilterService jpaFilterService() {
        return new JPAFilterServiceImpl();
    }

    @Bean
    public FilterTargetService jpaFilterTargetService() {
        return new JPAFilterTargetServiceImpl();
    }

    @Bean
    public MetadataResolverService metadataResolverService() {
        return new JPAMetadataResolverServiceImpl();
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
    public EntityDescriptorFilesScheduledTasks entityDescriptorFilesScheduledTasks(EntityDescriptorRepository entityDescriptorRepository, @Value("${shibui.metadata-dir}") final String metadataDir) {
        return new EntityDescriptorFilesScheduledTasks(metadataDir, entityDescriptorRepository, openSamlObjects());
    }

    @Bean
    @ConditionalOnProperty(name = "shibui.metadataProviders.target")
    public MetadataProvidersScheduledTasks metadataProvidersScheduledTasks(@Value("${shibui.metadataProviders.target}") final Resource resource, final MetadataResolverService metadataResolverService) {
        return new MetadataProvidersScheduledTasks(resource, metadataResolverService);
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
     * inspired by [ https://stackoverflow.com/questions/13482020/encoded-slash-2f-with-spring-requestmapping-path-param-gives-http-400 ]
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
    public MetadataResolversPositionOrderContainerService
        metadataResolversPositionOrderContainerService(MetadataResolversPositionOrderContainerRepository
                                                               positionOrderContainerRepository,
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
}
